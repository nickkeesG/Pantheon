import { useCallback, useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../hooks';
import { GetSurprisal } from '../llmHandler';
import BaseDaemon from '../daemons/baseDaemon';
import { dispatchError } from '../errorHandler';
import { selectIdeasById, setSurprisalToIdea } from '../redux/ideaSlice';

const Synchronizer = () => {
  const dispatch = useAppDispatch();
  const currentBranchIdeas = useAppSelector(selectCurrentBranchIdeas);
  const openAIKey = useAppSelector(state => state.config.openAIKey);
  const openAIOrgId = useAppSelector(state => state.config.openAIOrgId);
  const baseModel = useAppSelector(state => state.config.baseModel);
  const baseDaemonConfig = useAppSelector(state => state.daemon.baseDaemon);
  const [baseDaemon, setBaseDaemon] = useState<BaseDaemon | null>(null);
  const [currentlyRequestingSurprisal, setCurrentlyRequestingSurprisal] = useState(false);
  const synchronizerActive = useAppSelector(state => state.config.isSynchronizerActive);

  useEffect(() => {
    const daemon = baseDaemonConfig ? new BaseDaemon(baseDaemonConfig) : null;
    setBaseDaemon(daemon);
  }, [baseDaemonConfig]);

  // Gets surprisal for a single idea, and dispatches it to redux
  const requestSurprisal = useCallback(async (fullContext: string, partialContext: string, targetString: string, ideaId: number) => {
    setCurrentlyRequestingSurprisal(true);
    try {
      const surprisalData = await GetSurprisal(fullContext, partialContext, targetString, openAIKey, openAIOrgId, baseModel);
      const tokenList = surprisalData.map(s => s.token);
      const surprisalList = surprisalData.map(s => s.surprisal);
      dispatch(setSurprisalToIdea({ ideaId: ideaId, textTokens: tokenList, tokenSurprisals: surprisalList }));
    } catch (error) {
      console.error(error);
    }
    setCurrentlyRequestingSurprisal(false);
  }, [openAIKey, openAIOrgId, baseModel, dispatch]);

  useEffect(() => {
    const daemon = baseDaemonConfig ? new BaseDaemon(baseDaemonConfig) : null;
    setBaseDaemon(daemon);
  }, [baseDaemonConfig]);

  /*
  Measure surprisal on user text. Runs every 500ms.
  Surprisal is defined as a decrease in loglikelihood of a token after conditioning on the past context
  */
  // TODO Disabled due to network and processing load. Enable later once improved.
  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     if (!currentlyRequestingSurprisal && synchronizerActive) {
  //       if (baseDaemon && activeIdeas.length > 0) {         
  //         for (let i = 0; i < activeIdeas.length; i++) {
  //           if (activeIdeas[i].textTokens.length === 0) {
  //             if(!openAIKey) {
  //               dispatchError("OpenAI API key not set");
  //               return;
  //             }

  //             let targetString = activeIdeas[i].text;
  //             let pastIdeas = activeIdeas.slice(0, i);

  //             let fullContext = baseDaemon.getContextWithPrefix(pastIdeas);
  //             let partialContext = baseDaemon.getPrefix();
  //             requestSurprisal(fullContext, partialContext, targetString, activeIdeas[i].id);
  //             break;
  //           }
  //         }
  //       }
  //     }
  //   }, 1000);

  //   return () => {
  //     clearInterval(interval);
  //   };
  // }, [activeIdeas, 
  //     baseDaemon, 
  //     baseModel, 
  //     openAIKey, 
  //     openAIOrgId, 
  //     currentlyRequestingSurprisal, 
  //     synchronizerActive, 
  //     requestSurprisal]);

  return null;
}

export default Synchronizer;