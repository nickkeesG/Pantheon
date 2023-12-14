import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../hooks';
import { setSurprisalToIdea, selectCurrentBranchIdeas } from '../redux/textSlice';
import { Idea } from '../redux/models';
import { GetSurprisal } from '../LLMHandler';
import BaseDaemon from '../daemons/BaseDaemon';

const Synchronizer = () => {
  const dispatch = useAppDispatch();
  const pastIdeas = useAppSelector(selectCurrentBranchIdeas);
  const openAIKey = useAppSelector(state => state.llm.openAIKey);
  const openAIOrgId = useAppSelector(state => state.llm.openAIOrgId);
  const baseModel = useAppSelector(state => state.llm.baseModel);
  const baseDaemonConfig = useAppSelector(state => state.daemon.baseDaemon);
  const [baseDaemon, setBaseDaemon] = useState<BaseDaemon | null>(null);

  const [alreadyRequestedSurprisal, setAlreadyRequestedSurprisal] = useState(false);

  useEffect(() => {
    const daemon = baseDaemonConfig ? new BaseDaemon(baseDaemonConfig) : null;
    setBaseDaemon(daemon);
  }, [baseDaemonConfig]);

  useEffect(() => {

    const requestSurprisal = async (fullContext: string, partialContext: string, targetString: string, ideaId: number) => {
      try {
        const surprisalData = await GetSurprisal(fullContext, partialContext, targetString, openAIKey, openAIOrgId, baseModel);
        const tokenList = surprisalData.map(s => s.token);
        const surprisalList = surprisalData.map(s => s.surprisal);
        console.log("got surprisal for idea " + ideaId);
        dispatch(setSurprisalToIdea({ ideaId: ideaId, textTokens: tokenList, tokenSurprisals: surprisalList }));
      } catch (error) {
        console.error(error);
      }
      setAlreadyRequestedSurprisal(false);
    }

    const getFullContext = (pastIdeas: Idea[], ideaId: number, daemon: BaseDaemon) => {
      let fullContext = "";
      for (let i = 0; i < ideaId; i++) {
        fullContext += '\n' + daemon.ideaTemplate.replace("{}", pastIdeas[i].text);
      }

      fullContext = daemon.mainTemplate.replace("{}", fullContext);
      const ideaPrefix = daemon.ideaTemplate.substring(0, daemon.ideaTemplate.indexOf("{}"));
      fullContext += "\n" + ideaPrefix;
      return fullContext;
    }

    const getPartialContext = (pastIdeas: Idea[], ideaId: number, daemon: BaseDaemon) => {
      //let partialContext = daemon.ideaTemplate.replace("{}", pastIdeas[ideaId - 1].text);
      const ideaPrefix = daemon.ideaTemplate.substring(0, daemon.ideaTemplate.indexOf("{}"));
      //partialContext += "\n" + ideaPrefix;
      let partialContext = ideaPrefix;
      return partialContext;
    }

    const interval = setInterval(() => {
      if (!alreadyRequestedSurprisal) {
        console.log("checking ideas missing surprisal");
        if (baseDaemon && pastIdeas.length > 0) {
          for (let i = 0; i < pastIdeas.length; i++) {
            if (pastIdeas[i].textTokens.length === 0) {
              console.log("idea " + pastIdeas[i].id + " is missing surprisal");
              let targetString = pastIdeas[i].text;
              let fullContext = getFullContext(pastIdeas, i, baseDaemon);
              let partialContext = getPartialContext(pastIdeas, i, baseDaemon);

              console.log("requesting surprisal for idea " + pastIdeas[i].id);
              setAlreadyRequestedSurprisal(true);
              requestSurprisal(fullContext, partialContext, targetString, pastIdeas[i].id);
              break;
            }
          }

        }
      }

    }, 500);

    return () => {
      clearInterval(interval);
    };
  }, [pastIdeas, baseDaemon, openAIKey, openAIOrgId, baseModel, dispatch, alreadyRequestedSurprisal]);

  return null;
}

export default Synchronizer;