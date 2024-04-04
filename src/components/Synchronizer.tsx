import { useCallback, useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../hooks';
import { Idea } from '../redux/models';
import { GetSurprisal } from '../llmHandler';
import BaseDaemon from '../daemons/baseDaemon';
import {dispatchError} from '../errorHandler';
import { selectIdeasById, setSurprisalToIdea } from '../redux/ideaSlice';

const Synchronizer = () => {
  const dispatch = useAppDispatch();
  const activeIdeaIds = useAppSelector(state => state.ui.activeIdeaIds);
  const activeIdeas = useAppSelector(state => selectIdeasById(state, activeIdeaIds));
  const openAIKey = useAppSelector(state => state.config.openAIKey);
  const openAIOrgId = useAppSelector(state => state.config.openAIOrgId);
  const baseModel = useAppSelector(state => state.config.baseModel);
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
 // TODO Disabled due to network and processing load. Enable later once improved.
  useEffect(() => {
    const interval = setInterval(() => {
      if (!currentlyRequestingSurprisal) {
        if (baseDaemon && activeIdeas.length > 0) {   
          if(!openAIKey) {
            dispatchError("OpenAI API key not set");
            return;
          }      
          for (let i = 0; i < activeIdeas.length; i++) {
            if (activeIdeas[i].isUser && activeIdeas[i].textTokens.length === 0) {
              let targetString = activeIdeas[i].text;
              let fullContext = getFullContext(activeIdeas, i, baseDaemon);
              let partialContext = getPartialContext(activeIdeas, i, baseDaemon);
              requestSurprisal(fullContext, partialContext, targetString, activeIdeas[i].id);
              break;
            }
          }
        }
      }
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [activeIdeas, 
      baseDaemon, 
      baseModel, 
      openAIKey, 
      openAIOrgId, 
      currentlyRequestingSurprisal,
      getFullContext, 
      getPartialContext, 
      requestSurprisal]);

  return null;
}

export default Synchronizer;