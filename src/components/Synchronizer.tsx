import { useCallback, useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../hooks';
import { Idea } from '../redux/models';
import { setSurprisalToIdea, selectCurrentBranchIdeas } from '../redux/textSlice';
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
  const [currentlyRequestingSurprisal, setCurrentlyRequestingSurprisal] = useState(false);

  // Gets surprisal for a single idea, and dispatches it to redux
  const requestSurprisal = useCallback(async (fullContext: string, partialContext: string, targetString: string, ideaId: number) => {
    setCurrentlyRequestingSurprisal(true);
    try {
      const surprisalData = await GetSurprisal(fullContext, partialContext, targetString, openAIKey, openAIOrgId, baseModel);
      const tokenList = surprisalData.map(s => s.token);
      const surprisalList = surprisalData.map(s => s.surprisal);
      console.log("got surprisal for idea " + ideaId);
      dispatch(setSurprisalToIdea({ ideaId: ideaId, textTokens: tokenList, tokenSurprisals: surprisalList }));
    } catch (error) {
      console.error(error);
    }
    setCurrentlyRequestingSurprisal(false);
  }, [openAIKey, openAIOrgId, baseModel, dispatch]);

  // Currently surprisal is measured by only showing the model user generated ideas
  const getFullContext = useCallback((pastIdeas: Idea[], ideaId: number, daemon: BaseDaemon) => {
    let fullContext = "";
    for (let i = 0; i < ideaId; i++) {
      fullContext += '\n' + daemon.ideaTemplate.replace("{}", pastIdeas[i].text);
    }

    fullContext = daemon.mainTemplate.replace("{}", fullContext);
    const ideaPrefix = daemon.ideaTemplate.substring(0, daemon.ideaTemplate.indexOf("{}"));
    fullContext += "\n" + ideaPrefix;
    return fullContext;
  }, []);

  // Partial context is just the idea prefix (and implicity, any previous tokens in the same idea)
  const getPartialContext = useCallback((pastIdeas: Idea[], ideaId: number, daemon: BaseDaemon) => {
    const ideaPrefix = daemon.ideaTemplate.substring(0, daemon.ideaTemplate.indexOf("{}"));
    let partialContext = ideaPrefix;
    return partialContext;
  }, []);

  useEffect(() => {
    const daemon = baseDaemonConfig ? new BaseDaemon(baseDaemonConfig) : null;
    setBaseDaemon(daemon);
  }, [baseDaemonConfig]);

  /*
  Measure surprisal on user text. Runs every 500ms.
  Surprisal is defined as a decrease in loglikelihood of a token after conditioning on the past context
  */
  useEffect(() => {
    const interval = setInterval(() => {
      if (!currentlyRequestingSurprisal) {
        if (baseDaemon && pastIdeas.length > 0) {
          for (let i = 0; i < pastIdeas.length; i++) {
            if (pastIdeas[i].textTokens.length === 0) {
              console.log("idea " + pastIdeas[i].id + " is missing surprisal");
              let targetString = pastIdeas[i].text;
              let fullContext = getFullContext(pastIdeas, i, baseDaemon);
              let partialContext = getPartialContext(pastIdeas, i, baseDaemon);

              console.log("requesting surprisal for idea " + pastIdeas[i].id);
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
  }, [pastIdeas, baseDaemon, baseModel, openAIKey, openAIOrgId, currentlyRequestingSurprisal, getFullContext, getPartialContext, requestSurprisal]);

  return null;
}

export default Synchronizer;