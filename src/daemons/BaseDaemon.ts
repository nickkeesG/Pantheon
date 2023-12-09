import {GenerateBaseComments} from '../LLMHandler';
import { Comment, Idea } from '../redux/textSlice';

const baseTemplate = '# Brainstorming\n{}';
const ideaTemplate = '-{}';
const commentTemplate = '  -[{}]:{}';


class BaseDaemon {
  async generateComment(pastIdeas: Idea[], currentIdeas: Idea[], commentsForPastIdeas: Record<number, Comment[]>, openaiKey: string, openaiOrgId: string) {
    let context = "";

    for (let i = 0; i < pastIdeas.length; i++) {
      context += '\n' + ideaTemplate.replace("{}", pastIdeas[i].text);

      let comments = commentsForPastIdeas[pastIdeas[i].id] || [];
      for (let j = 0; j < comments.length; j++) {
        context += '\n' + commentTemplate.replace("{}", comments[j].daemonName).replace("{}", comments[j].text);
      }
    }
    
    // Pick a random current idea
    var randomIndex = Math.floor(Math.random() * currentIdeas.length);
    for (let i = 0; i < randomIndex + 1; i++) {
      context += '\n' + ideaTemplate.replace("{}", currentIdeas[i].text);
    }

    const commentPrefix= commentTemplate.substring(0, commentTemplate.indexOf("{}"));
    context += "\n" + commentPrefix;
    context = baseTemplate.replace("{}", context);
    console.log(context);

    var response = await GenerateBaseComments(context, openaiKey, openaiOrgId);
    console.log(context + response[0]);

    let commentTemplateDivider = "";
    const regex = /\{\}(.*?)\{\}/;
    const match = commentTemplate.match(regex);

    if (match && match[1]) {
        commentTemplateDivider = match[1];
    }
    else {  
        console.log("Error: Regex failed to match");
        return null;
    }

    var splitResponse = response[0].split(commentTemplateDivider);

    if (splitResponse.length < 2) {
      console.log("Error: Response did not contain divider");
      return null;
    }

    var daemonName = splitResponse[0].trim();
    var content = splitResponse[1].trim();

    console.log(daemonName);
    console.log(content);

    return {
      id: currentIdeas[randomIndex].id,
      daemonName: daemonName.trim(),
      content: content.trim()
    };
  }
}

export default BaseDaemon;