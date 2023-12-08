const baseTemplate = '# Brainstorming';
const ideaTemplate = '-';
const commentTemplate = '  -';


class BaseDaemon {


  async generateComment(pastIdeas: any, currentIdeas: any, commentsForPastIdeas: any, openaiKey: string, openaiOrgId: string) {
    var context = "";
    for (var i = 0; i < pastIdeas.length; i++) {
      history += this.historyTemplate.replace("{}", pastIdeas[i].text);
      if (i != pastIdeas.length - 1) {
        history += ",\n";
      }
    }
    var currentContext = "";
    for (var i = 0; i < currentIdeas.length; i++) {
      let tempId: number = i + 1;
      currentContext += this.ideaTemplate.replace("{}", tempId.toString()).replace("{}", currentIdeas[i].text);
      if (i != currentIdeas.length - 1) {
        currentContext += ",\n";
      }
    }
    var context = this.contextTemplate.replace("{}", history).replace("{}", currentContext);
    var userPrompts = [];
    userPrompts.push(context + "\n\n" + this.startInstruction);
    for (var i = 0; i < this.chainOfThoughtInstructions.length; i++) {
      userPrompts.push(this.chainOfThoughtInstructions[i]);
    }
    userPrompts.push(this.endInstruction);

    var comments = await GenerateChatComments(this.systemPrompt, userPrompts, openaiKey, openaiOrgId);

    // Parse the JSON string to a JavaScript object
    var commentsObj = JSON.parse(comments);
    var ranking = commentsObj.ranking;

    var results = [];
    for (var i = 0; i < ranking.length; i++) {
      console.log(`id: ${ranking[i].id}, content: ${ranking[i].content}`);
      // Add the id and content to the results array
      let tempId: number = ranking[i].id - 1;
      results.push({id: currentIdeas[tempId].id, content: ranking[i].content});
    }

    return results;
  }
}

export default BaseDaemon;