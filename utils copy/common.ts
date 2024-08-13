import {
  ApiResponse,
  Conversation,
  GeminiMessageResponse,
  MessageForReview,
  Personality,
  RemoteData,
  RemoteDataWithSetter,
  Review,
} from "@/type";
import { Dispatch, SetStateAction } from "react";
import { formatDistanceToNow } from "date-fns";
import { Part } from "@google/generative-ai";

export function removeJsonEncasing(text: string) {
  const pattern = /^```json\s+([\s\S]*?)\s+```$/;

  const result = text.replace(pattern, "$1");

  return result;
}

export function removeJsonMarkdown(text: string) {
  return text.replace("```json", "").replace("```", "");
}

export function createErrorResponse(message: string): Response {
  const res: ApiResponse<null> = {
    data: null,
    success: false,
    message: message,
  };

  return Response.json(res);
}

export function createSuccessResponse<T>(
  data: T,
  message: string = ""
): Response {
  const res: ApiResponse<T> = {
    data,
    success: true,
    message,
  };

  return Response.json(res);
}

export function getDefaultRemoteData<T>(data: T): RemoteData<T> {
  return {
    isLoading: false,
    data,
  };
}

export function getRemoteDataWithSetter<T>(
  remoteData: RemoteData<T>,
  setter: Dispatch<SetStateAction<RemoteData<T>>>
): RemoteDataWithSetter<T> {
  return { ...remoteData, setData: setter };
}

export function setRemoteDataLoading<T>(
  setter: Dispatch<SetStateAction<RemoteData<T>>>,
  value: boolean
) {
  setter((prev) => ({ ...prev, isLoading: value }));
}

export function generateUserConversationPrompt(
  conversation: Conversation,
  personality: Personality,
  user: string,
  language: string
): string {
  const prompt = `${personality.prompt}

You are ${personality.traits}.

user name: ${user}

language: ${language}

Your goal is to have a conversation with the user in the specified language. Respond based on your personality and the specified conversation topic in a way that steer towards the completion of the goal of the conversation.

Try to insert your personality and who you are as much as possible in your responses. Example: if you are a botanist, try to mention plants, etc.

Conversation topic: ${conversation.prompt}

goal of the conversation: ${conversation.goal}

Respond in the following format with JSON:
{
 "message": "Your response to the user. Or your message to start the conversation. This should be in the language specified.",
 "isGoalReached": "a boolean representing whether or not the specified goal of the conversation has been reached. Make sure the user has replied a few times at least before determining goal is reached (true). Be immensly strict about this and only set to true once the history of messages is representative of reaching the specified goal. This should still be in English regardless of the langauge specified for the conversation.",
 "mistakes": "if user message is not null, it should be string explaining what grammar/linguistic mistakes the user message has. If there are no mistakes or if user message is null, this should be null. This should still be in English regardless of the langauge specified for the conversation.",
 "correctedText": "if user message is not null and has mistakes, it should be string rewriting user message to be correct. If there are no mistakes or if user message is null, this should be null. This should still be in English regardless of the langauge specified for the conversation.",
 "explanation": "A string explaining in general grammar and linguistic concepts relating to either user message (if it has no mistakes) or the correctedText if it has any mistakes. If user message is null, this should be null. This should still be in English regardless of the langauge specified for the conversation.",
 "feedback": "A string giving feedback regardless of whether or not there are mistakes. Just advice for improvement. If user message is null, this should be null. This should still be in English regardless of the langauge specified for the conversation.",
 "translation": "A string English translation of message (your response to the user). If and only if language is English, this should be null.",
}

====
Example:
You are a 72-year old ex-astronaut from Russia. You are tired and always complaining. You hate when people mention the weather. You are from Texas.

You are grumpy and irritable.

user name: ansellmax

Conversation topic: discussing video games.

goal of the conversation: AI asks what a video game is and the user has mentioned their favorite game.

User: start the conversation
bot: "\`\`\`json
{
  "message": "Hey, kid. Need to ask you about them video games they keep talkin' about.",
  "isGoalReached": false,
  "mistakes": null,
  "correctedText": null,
  "explanation": null,
  "feedback": null,
  "translation": null
}
\`\`\`"

User: Sure, what are up?
bot: "\`\`\`json
{
  "message": "What are they, anyway? I get tired of heearin' my grandsons talking about them.",
  "isGoalReached": false,
   "mistakes": "The phrase 'What are up?' is incorrect. It should be 'What is up?' or simply 'What's up?'.",
  "correctedText": "What's up?",
  "explanation": "The phrase 'What are up?' is grammatically incorrect because 'what' should be followed by 'is' in this context. 'What's up?' is an informal greeting or way to ask someone how they are or what they are doing.",
  "feedback": "Good attempt at initiating a conversation! In casual English, 'What's up?' is a common and correct way to ask someone how they are doing. Keep practicing your greetings and casual phrases.",
  "translation": null
}
\`\`\`"

User: Video games are like entertainment that you can interact with. It's like reading the newspaper, but you are a part of what you're reading.
bot: "\`\`\`json
{
  "message": "Are you gettin' smart with me boy? Don't talk to me like I'm stupid. What's your favorite video game? I'm trying to buy one for my needy grandson.",
  "isGoalReached": false,
  "mistakes": null,
  "correctedText": null,
  "explanation": null,
  "feedback": "You've captured the interactive aspect of video games well. To improve, use comparisons that highlight the immersive experience of video games, such as being part of a movie or a book where you can influence the story.",
  "translation": null
}
\`\`\`"

User: I'm sorry, sir. I meant no disrispeck. My favorite is Fallout: New Vegas.
bot: "\`\`\`json
{
  "message": "Fine! Then that's what I'm gettin for him.",
  "isGoalReached": true,
   "mistakes": "The sentence 'I'm sorry, sir. I meant no disrispeck.' contains a spelling mistake and an informal contraction. 'disrispeck' should be 'disrespect.' The contraction 'meant no disrispeck' is informal and might not be suitable for all contexts.",
  "correctedText": "I'm sorry, sir. I meant no disrespect. My favorite is Fallout: New Vegas.",
  "explanation": "The original sentence contains a misspelling of 'disrespect.' In formal contexts, avoiding informal contractions and ensuring correct spelling improves clarity and professionalism.",
  "feedback": "Your apology and expression of your favorite game are clear. Just watch out for spelling errors and consider the formality of your language based on the context. It's great to share your personal favorites like Fallout: New Vegas!",
  "translation": null
}
\`\`\`"

Example 2:
You are a 72-year old ex-astronaut from Russia. You are tired and always complaining. You hate when people mention the weather. You are from Texas.

You are grumpy and irritable.

user name: ansellmax

Conversation topic: discussing video games.

goal of the conversation: AI asks what a video game is and the user has mentioned their favorite game.

User: start the conversation
bot: "\`\`\`json
{
 "message": "Hola, ¿cómo estás? Quiero preguntarte sobre los videojuegos.",
 "isGoalReached": false,
 "mistakes": null,
 "correctedText": null,
 "explanation": null,
 "feedback": null,
 "translation": "Hi, how are you? I want to ask you about video games."
}
\`\`\`"

User: Claro, ¿qué quieres saber?
bot: "\`\`\`json
{
 "message": "¿Qué son exactamente? Mis nietos no dejan de hablar de ellos.",
 "isGoalReached": false,
 "mistakes": null,
 "correctedText": null,
 "explanation": null,
 "feedback": null,
 "translation": "What are they exactly? My grandkids keep talking about them."
}
\`\`\`"

User: Los videojuegos son una forma de entretenimiento interactivo. Es como leer el periódico, pero formas parte de lo que estás leyendo.
bot: "\`\`\`json
{
 "message": "¿Me estás tomando el pelo? No me hables como si fuera tonto. ¿Cuál es tu videojuego favorito? Quiero comprar uno para mi nieto necesitado.",
 "isGoalReached": false,
 "mistakes": null,
 "correctedText": null,
 "explanation": null,
 "feedback": "You've captured the interactive aspect of video games well. To improve, use comparisons that highlight the immersive experience of video games, such as being part of a movie or a book where you can influence the story.",
 "translation": "Are you messing with me? Don't talk to me like I'm stupid. What's your favorite video game? I'm trying to buy one for my needy grandson."
}
\`\`\`"

User: Lo siento, señor. No quise faltarle al respeto. Mi favorito es Fallout: New Vegas.
bot: "\`\`\`json
{
 "message": "¡Bien! Entonces eso es lo que voy a comprar para él.",
 "isGoalReached": true,
 "mistakes": "The phrase 'No quise faltarle al respeto' is correct, but 'faltarle' can be replaced with 'ofenderlo' for greater clarity. 'Mi favorito es Fallout: New Vegas.' is correct.",
 "correctedText": "Lo siento, señor. No quise ofenderlo. Mi favorito es Fallout: New Vegas.",
 "explanation": "The word 'ofenderlo' may be more direct than 'faltarle al respeto' in this context. Both are correct, but 'ofenderlo' is more common in everyday language.",
 "feedback": "Your apology and expression of your favorite video game are clear. Just be careful with the words you choose to ensure your message is as clear as possible. It's great to share your favorites like Fallout: New Vegas!",
 "translation": "Fine! Then that's what I'm getting for him."
}
\`\`\`"
`;
  return prompt;
}

export function getConversationLoadingMessage(progress: 0 | 1 | 2 | 3 | 4) {
  switch (progress) {
    case 0:
      return "Loading user conversation...";
    case 1:
      return "Loading conversation...";
    case 2:
      return "Loading AI personality...";
    case 3:
      return "Loading messages...";

    case 4:
      return "Loading complete.";

      break;

    default:
      break;
  }
}

export function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function geminiResHasExtras(res: GeminiMessageResponse) {
  return res.mistakes || res.correctedText || res.explanation || res.feedback;
}

export function hasBeenAWeekSince(updatedAt: string): boolean {
  const currentDate = new Date();
  const updatedAtDate = new Date(updatedAt);

  return (
    currentDate.getTime() - updatedAtDate.getTime() >= 7 * 24 * 60 * 60 * 1000
  );
}

export function timeSince(now: string): string {
  const nowDate = new Date(now);

  return formatDistanceToNow(nowDate, { addSuffix: true });
}

export function getGenerateReviewPrompt(
  language: string,
  latestReview: Review | null,
  messages: MessageForReview[]
): Part[] {
  const parts: Part[] = [
    {
      text: 'Generate JSON that represents a review of a user\'s progress or just general knowledge level in a language based on text messages they sent as well as a previous review (if there\'s any). It should be in the following format:  \n\n```json  { "summary": "A string representing the summary of the user\'s knowledge level in the particular language and how they have progressed since last review (only if it\'s provided)",    "vocabulary": {      "review": "A short description of the user\'s level of vocabulary",      "score": "a number out of then representing the score based on the user\'s vocabulary"    },    "grammar": {      "review": "A short description of the user\'s level of grammar",      "score": "a number out of then representing the score based on the user\'s grammar"    },    "spelling": {      "review": "A short description of the user\'s level of spelling",      "score": "a number out of then representing the score based on the user\'s spelling"    }  }  ```',
    },
    { text: "language: es-ES" },
    {
      text: 'messages: [\n    {\n        "text": "Si a mi me encanta eso",\n        "mistakes": null,\n        "correctedText": null\n    },\n    {\n        "text": "yo no sabes",\n        "mistakes": "The user wrote \'yo no sabes\' which is not correct. The correct sentence would be \'Yo no sé.\'",\n        "correctedText": "Yo no sé."\n    },\n    {\n        "text": "la apocalypso es muy scary",\n        "mistakes": "The user used the word \'apocalypso\' which seems to be a mix of \'apocalypse\' and possibly \'calypso\' (a type of music). Additionally, \'scary\' is an informal word choice and could be substituted for a more formal word like \'frightening.\'",\n        "correctedText": "The apocalypse is very frightening."\n    }\n]',
    },
    { text: "latest review: none" },
    {
      text: 'json: ```json\n{  "summary": "During this review session, the user demonstrated a good understanding of basic Spanish phrases and expressions. The first sentence, \\"Si a mi me encanta eso,\\" was perfectly constructed, indicating familiarity with expressing personal preferences in Spanish. However, there were notable areas for improvement in grammar and vocabulary usage. For instance, the phrase \\"yo no sabes\\" was corrected to \\"Yo no sé,\\" highlighting the need to correctly conjugate verbs. Additionally, the user mixed English and Spanish in \\"la apocalypso es muy scary,\\" and used an incorrect word form. This was corrected to \\"The apocalypse is very frightening,\\" showcasing the importance of choosing the right words and maintaining consistency in language use. Overall, the user shows promise but needs to focus more on grammar and vocabulary to achieve fluency.",    "vocabulary": {    "review": "The user\'s vocabulary is expanding, but there is room for improvement. They correctly used words to express personal likes in Spanish. However, the word \\"apocalypso\\" was a mix-up, and \\"scary\\" was too informal. It\'s important to learn and use precise vocabulary appropriate for different contexts.",    "score": 6  },  "grammar": {    "review": "The user struggled with verb conjugation in the phrase \\"yo no sabes,\\" which was corrected to \\"Yo no sé.\\" This indicates a need to review basic grammar rules, especially verb conjugations and subject-verb agreement. Improving these areas will significantly enhance the user\'s ability to communicate accurately.",    "score": 5  },  "spelling": {    "review": "There were no spelling mistakes in the user\'s submissions. The correct spelling of words like \\"encanta\\" and \\"scary\\" (although the latter was not contextually appropriate) shows a good grasp of spelling.",    "score": 8  }}\n```',
    },
    { text: "language: es-ES" },
    {
      text: 'messages: [\n  {\n    "text": "Me gusta la musica pop",\n    "mistakes": null,\n    "correctedText": null\n  },\n  {\n    "text": "Ella es muy simpatica, y ella siempre sonreir",\n    "mistakes": "The user wrote \'ella siempre sonreir\' which should be \'ella siempre sonríe.\' The verb should be conjugated correctly.",\n    "correctedText": "Ella es muy simpática, y ella siempre sonríe."\n  },\n  {\n    "text": "Nosotros vamos a la playa cada verano",\n    "mistakes": null,\n    "correctedText": null\n  },\n  {\n    "text": "El gato es en la silla",\n    "mistakes": "The user wrote \'es en la silla\' which should be \'está en la silla.\' The correct form of \'to be\' should be used here.",\n    "correctedText": "El gato está en la silla."\n  },\n  {\n    "text": "Yo tiene dos hermanos",\n    "mistakes": "The user wrote \'yo tiene\' which should be \'yo tengo.\' The verb needs to be conjugated correctly.",\n    "correctedText": "Yo tengo dos hermanos."\n  }\n]',
    },
    {
      text: 'latest review: {  "summary": "During this review session, the user demonstrated a good understanding of basic Spanish phrases and expressions. The first sentence, \\"Si a mi me encanta eso,\\" was perfectly constructed, indicating familiarity with expressing personal preferences in Spanish. However, there were notable areas for improvement in grammar and vocabulary usage. For instance, the phrase \\"yo no sabes\\" was corrected to \\"Yo no sé,\\" highlighting the need to correctly conjugate verbs. Additionally, the user mixed English and Spanish in \\"la apocalypso es muy scary,\\" and used an incorrect word form. This was corrected to \\"The apocalypse is very frightening,\\" showcasing the importance of choosing the right words and maintaining consistency in language use. Overall, the user shows promise but needs to focus more on grammar and vocabulary to achieve fluency.",    "vocabulary": {    "review": "The user\'s vocabulary is expanding, but there is room for improvement. They correctly used words to express personal likes in Spanish. However, the word \\"apocalypso\\" was a mix-up, and \\"scary\\" was too informal. It\'s important to learn and use precise vocabulary appropriate for different contexts.",    "score": 6  },  "grammar": {    "review": "The user struggled with verb conjugation in the phrase \\"yo no sabes,\\" which was corrected to \\"Yo no sé.\\" This indicates a need to review basic grammar rules, especially verb conjugations and subject-verb agreement. Improving these areas will significantly enhance the user\'s ability to communicate accurately.",    "score": 5  },  "spelling": {    "review": "There were no spelling mistakes in the user\'s submissions. The correct spelling of words like \\"encanta\\" and \\"scary\\" (although the latter was not contextually appropriate) shows a good grasp of spelling.",    "score": 8  }}',
    },
    {
      text: 'json: ```json\n{\n  "summary": "In this review session, the user continued to show a good grasp of basic Spanish phrases and expressions. The sentence \\"Me gusta la musica pop\\" was perfectly constructed, demonstrating an ability to express personal preferences correctly. Similarly, \\"Nosotros vamos a la playa cada verano\\" was accurate, indicating familiarity with common verbs and time expressions. However, there were still notable areas for improvement in grammar, particularly with verb conjugation and the use of the verb \'to be.\' For instance, the phrase \\"ella siempre sonreir\\" was corrected to \\"ella siempre sonríe,\\" highlighting the need to correctly conjugate verbs. Another example is \\"el gato es en la silla,\\" which was corrected to \\"el gato está en la silla,\\" showing the importance of using the correct form of \'to be\' based on context. Additionally, the user wrote \\"yo tiene dos hermanos,\\" which was corrected to \\"yo tengo dos hermanos,\\" further emphasizing the need to focus on proper verb conjugation. Overall, while the user continues to show promise, consistent practice with grammar rules, especially verb conjugations, will be essential for achieving fluency.",\n  \n  "vocabulary": {\n    "review": "The user\'s vocabulary remains strong, as demonstrated by correctly used phrases such as \\"Me gusta la musica pop\\" and \\"Nosotros vamos a la playa cada verano.\\" These examples show a growing ability to describe preferences and routine activities. However, occasional mix-ups like \\"simpatica\\" instead of \\"simpática\\" suggest the need for ongoing vocabulary review.",\n    "score": 7\n  },\n\n  "grammar": {\n    "review": "Grammar continues to be an area needing improvement. Errors such as \\"ella siempre sonreir\\" instead of \\"ella siempre sonríe,\\" and \\"yo tiene\\" instead of \\"yo tengo\\" indicate a need for further practice with verb conjugations. Additionally, using the correct form of \'to be\' remains a challenge, as seen in \\"el gato es en la silla\\" versus the correct \\"el gato está en la silla.\\" Focused exercises on these areas will help solidify the user\'s grammatical skills.",\n    "score": 5\n  },\n\n  "spelling": {\n    "review": "Spelling is generally accurate, with correct spellings in phrases like \\"Me gusta la musica pop\\" and \\"Nosotros vamos a la playa cada verano.\\" There are minor issues, such as \\"simpatica\\" needing an accent to be \\"simpática,\\" but overall, the user\'s spelling proficiency is solid.",\n    "score": 8\n  }\n}\n```',
    },
    { text: "language: es-ES" },
    {
      text: 'messages: [\n  {\n    "text": "Ayer fui al cine y vi una película muy buena",\n    "mistakes": null,\n    "correctedText": null\n  },\n  {\n    "text": "Siempre me gusta leer libros por la noche antes de dormir",\n    "mistakes": null,\n    "correctedText": null\n  },\n  {\n    "text": "Ella es una amiga increíble y siempre me apoya en todo",\n    "mistakes": null,\n    "correctedText": null\n  },\n  {\n    "text": "Nosotros viajamos a España el verano pasado y lo pasamos genial",\n    "mistakes": null,\n    "correctedText": null\n  },\n  {\n    "text": "Estoy aprendiendo español porque quiero viajar por América Latina",\n    "mistakes": null,\n    "correctedText": null\n  }\n]',
    },
    {
      text: 'latest review: {\n  "summary": "In this review session, the user continued to show a good grasp of basic Spanish phrases and expressions. The sentence \\"Me gusta la musica pop\\" was perfectly constructed, demonstrating an ability to express personal preferences correctly. Similarly, \\"Nosotros vamos a la playa cada verano\\" was accurate, indicating familiarity with common verbs and time expressions. However, there were still notable areas for improvement in grammar, particularly with verb conjugation and the use of the verb \'to be.\' For instance, the phrase \\"ella siempre sonreir\\" was corrected to \\"ella siempre sonríe,\\" highlighting the need to correctly conjugate verbs. Another example is \\"el gato es en la silla,\\" which was corrected to \\"el gato está en la silla,\\" showing the importance of using the correct form of \'to be\' based on context. Additionally, the user wrote \\"yo tiene dos hermanos,\\" which was corrected to \\"yo tengo dos hermanos,\\" further emphasizing the need to focus on proper verb conjugation. Overall, while the user continues to show promise, consistent practice with grammar rules, especially verb conjugations, will be essential for achieving fluency.",\n  \n  "vocabulary": {\n    "review": "The user\'s vocabulary remains strong, as demonstrated by correctly used phrases such as \\"Me gusta la musica pop\\" and \\"Nosotros vamos a la playa cada verano.\\" These examples show a growing ability to describe preferences and routine activities. However, occasional mix-ups like \\"simpatica\\" instead of \\"simpática\\" suggest the need for ongoing vocabulary review.",\n    "score": 7\n  },\n\n  "grammar": {\n    "review": "Grammar continues to be an area needing improvement. Errors such as \\"ella siempre sonreir\\" instead of \\"ella siempre sonríe,\\" and \\"yo tiene\\" instead of \\"yo tengo\\" indicate a need for further practice with verb conjugations. Additionally, using the correct form of \'to be\' remains a challenge, as seen in \\"el gato es en la silla\\" versus the correct \\"el gato está en la silla.\\" Focused exercises on these areas will help solidify the user\'s grammatical skills.",\n    "score": 5\n  },\n\n  "spelling": {\n    "review": "Spelling is generally accurate, with correct spellings in phrases like \\"Me gusta la musica pop\\" and \\"Nosotros vamos a la playa cada verano.\\" There are minor issues, such as \\"simpatica\\" needing an accent to be \\"simpática,\\" but overall, the user\'s spelling proficiency is solid.",\n    "score": 8\n  }\n}',
    },
    {
      text: 'json: ```json\n{\n  "summary": "The user continues to demonstrate a good understanding of Spanish, showcasing consistent improvement since the last review. They accurately use basic phrases and express themselves naturally with correct verb conjugations, as shown in sentences like \\"Ayer fui al cine y vi una película muy buena\\" and \\"Ella es una amiga increíble y siempre me apoya en todo.\\" This indicates good grasp of past tense verbs, adjectives and adverbs. The user also applies common time expressions and phrases correctly, like \\"por la noche antes de dormir\\" and \\"el verano pasado.\\" They demonstrate a strong understanding of vocabulary, selecting appropriate words to convey their ideas, and the use of diverse verbs and expressions reflects their expanding vocabulary.  The user continues to show a strong foundation and progress, highlighting their dedication to learning Spanish. With continued practice, the user will continue to develop fluency and confidence in the language.",\n  "vocabulary": {\n    "review": "The user displays a good range of vocabulary, using words and phrases accurately to express different ideas and concepts. They demonstrate knowledge of various verbs, adjectives, adverbs, and common expressions. The use of words like \\"increíble\\", \\"apoyar\\", \\"viajar\\", and \\"genial\\" shows a growing vocabulary and ability to describe a variety of situations and emotions. They also correctly use prepositions and conjunctions, showcasing a good understanding of sentence structure.",\n    "score": 9\n  },\n  "grammar": {\n    "review": "The user demonstrates a strong understanding of grammar, with few noticeable errors. The correct use of verb conjugations in sentences like \\"fui\\", \\"vi\\", \\"me gusta\\", and \\"viajamos\\" highlights a solid grasp of past tense and present tense verbs. They also apply basic grammatical rules like subject-verb agreement and gender agreement accurately. The user is demonstrating proficiency in using the correct forms of verbs and articles, suggesting a good understanding of Spanish grammatical rules.",\n    "score": 8\n  },\n  "spelling": {\n    "review": "The user\'s spelling is consistently accurate. There were no misspellings observed in the sample text, indicating a good understanding of Spanish spelling rules and patterns. The user is able to correctly spell a variety of words, including verbs, adjectives, and common nouns, showing a good grasp of the Spanish orthography.",\n    "score": 10\n  }\n}\n```',
    },
    { text: `language: ${language}` },
    { text: `messages: ${JSON.stringify(messages)}` },
    {
      text: `latest review: ${latestReview ? latestReview.reviewJSON : "null"}`,
    },
    { text: "json: " },
  ];
  return parts;
}
export function surroundMessageWithQuotes(input: string) {
  return input.replace(/(?<="message": )(.*?)(?=,\n)/g, (match) => {
    // Surround the match with quotes
    const startIsQuote = match.startsWith('"');
    const endIsQuote = match[match.length - 1] === '"';

    console.log({ startIsQuote, endIsQuote });

    if (startIsQuote && endIsQuote) return match;
    else if (startIsQuote) return `${match}"`;
    else if (endIsQuote) return `"${match}`;
    return `"${match}"`;
  });
}
