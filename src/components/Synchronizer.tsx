import { useCallback, useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../hooks';
import { GetSurprisal } from '../llmHandler';
import BaseDaemon from '../daemons/baseDaemon';
import {dispatchError} from '../errorHandler';
import { selectCurrentBranchIdeas, setSurprisalToIdea, setMentionToIdea } from '../redux/ideaSlice';
import { selectEnabledChatDaemons } from '../redux/daemonSlice';

const Synchronizer = () => {
  const dispatch = useAppDispatch();
  const currentBranchIdeas = useAppSelector(selectCurrentBranchIdeas);
  const openAIKey = useAppSelector(state => state.config.openAIKey);
  const openAIOrgId = useAppSelector(state => state.config.openAIOrgId);
  const baseModel = useAppSelector(state => state.config.baseModel);
  const baseDaemonConfig = useAppSelector(state => state.daemon.baseDaemon);
  const chatDaemonConfigs = useAppSelector(selectEnabledChatDaemons);
  const [baseDaemon, setBaseDaemon] = useState<BaseDaemon | null>(null);
  const [chatDaemonNames, setChatDaemonNames] = useState<string[]>([]);
  const [currentlyRequestingSurprisal, setCurrentlyRequestingSurprisal] = useState(false);

  useEffect(() => {
    const daemon = baseDaemonConfig ? new BaseDaemon(baseDaemonConfig) : null;
    setBaseDaemon(daemon);
  }, [baseDaemonConfig]);

  useEffect(() => {
    const daemonNames = chatDaemonConfigs.map(config => config.name);
    setChatDaemonNames(daemonNames);
  }, [chatDaemonConfigs]);

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
  useEffect(() => {
    const interval = setInterval(() => {
      if (!currentlyRequestingSurprisal) {
        if (baseDaemon && currentBranchIdeas.length > 0) {         
          for (let i = 0; i < currentBranchIdeas.length; i++) {
            if (currentBranchIdeas[i].textTokens.length === 0) {
              if(!openAIKey) {
                dispatchError("OpenAI API key not set");
                return;
              }

              // Find first mention to a chat daemons in the text (ignore case)
              const chatDaemonNamesWithAt = chatDaemonNames.map(name => '@' + name);
              const firstMention = chatDaemonNamesWithAt.find(name => 
                new RegExp(name, 'i').test(currentBranchIdeas[i].text)
              );
              if (firstMention) {
                const daemonName = firstMention.slice(1); //remove the at sign
                dispatch(setMentionToIdea({ ideaId: currentBranchIdeas[i].id, mention: daemonName}));
              }

              // Get surprisal for the first idea without surprisal
              let targetString = currentBranchIdeas[i].text;
              let pastIdeas = currentBranchIdeas.slice(0, i);

              let fullContext = baseDaemon.getContextWithPrefix(pastIdeas);
              let partialContext = baseDaemon.getPrefix();
              requestSurprisal(fullContext, partialContext, targetString, currentBranchIdeas[i].id);
              break;
            }
          }
        }
      }
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [currentBranchIdeas, 
      baseDaemon, 
      baseModel, 
      openAIKey, 
      openAIOrgId, 
      chatDaemonNames,
      currentlyRequestingSurprisal,
      requestSurprisal,
      dispatch]);

  return null;
}

export default Synchronizer;