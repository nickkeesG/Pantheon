import {GenerateBaseComments} from '../LLMHandler';

const baseTemplate = '# Brainstorming';
const ideaTemplate = '-';
const commentTemplate = '  -';


class BaseDaemon {


  async generateComment(pastIdeas: any, currentIdeas: any, commentsForPastIdeas: any, openaiKey: string, openaiOrgId: string) {
    var context = baseTemplate;

    for (var i = 0; i < pastIdeas.length; i++) {
      context += '\n' + ideaTemplate + ' ' + pastIdeas[i].text;
      
      var comments = commentsForPastIdeas[pastIdeas[i].id];
      for (var j = 0; j < comments.length; j++) {
        context += '\n' + commentTemplate + ' [' + comments[j].daemonName + "]: " + comments[j].text;
      }
    }
    
    // Pick a random current idea
    var randomIndex = Math.floor(Math.random() * currentIdeas.length);
    for (var i = 0; i < randomIndex + 1; i++) {
      context += '\n' + ideaTemplate + ' ' + currentIdeas[i].text;
    }

    context += '\n' + commentTemplate + ' ['; 
    console.log(context);

    var response = await GenerateBaseComments(context, openaiKey, openaiOrgId);
    console.log(context + response);
    
    // Adjust the regex to account for the brackets
    const [daemonNameWithBrackets, content] = response[0].split(/]:\s*(.+)/);
    // Remove the brackets from the daemon name
    const daemonName = daemonNameWithBrackets.replace('[', '').replace(']', '').trim();

    console.log(daemonName);
    console.log(content);

    if(daemonName == "" || content == "") {
      return null;
    }

    return {
      id: currentIdeas[randomIndex].id,
      daemonName: daemonName.trim(),
      content: content.trim()
    };
  }
}

export default BaseDaemon;