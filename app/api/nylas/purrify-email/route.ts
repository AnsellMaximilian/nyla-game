export const maxDuration = 50; // This function can run for a maximum of 50 seconds

import { decrypt } from "@/lib/session";
import { GrantRecord, PlayerNyla } from "@/type";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from "@google/generative-ai";

export async function POST(req: NextRequest) {
  const session = await decrypt(cookies().get("session")?.value);
  const body = (await req.json()) as { emailBody: string };

  if (!session?.grantRecordId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const apiKey = String(process.env.GEMINI_API_KEY);
    const genAI = new GoogleGenerativeAI(apiKey);

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
    });

    const generationConfig = {
      temperature: 1,
      topP: 0.95,
      topK: 64,
      maxOutputTokens: 8192,
      responseMimeType: "text/plain",
    };

    const parts = [
      {
        text: "Generate a \"cat-speak\" version of the given email. Use puns like purr, paw, and others. Make sure the cat speak version is still comprehensible and doesn't lose any detail. Make sure the original isn't lost.",
      },
      {
        text: 'email: Dear Mr. Smith,\n\nI hope this email finds you well. I wanted to follow up regarding the project proposal I submitted last week for the "Urban Development Initiative." I would greatly appreciate it if you could provide any feedback or let me know if there are any additional details required.\n\nAdditionally, if you have any questions or need further clarification on any aspect of the proposal, please do not hesitate to reach out. I am more than happy to provide further information to ensure all your concerns are addressed.\n\nThank you for your time and consideration. I look forward to your response.\n\nBest regards,\n\nJessica Taylor\nProject Manager\nTaylor & Co.',
      },
      {
        text: 'cat speak version: Dear Mr. Smeowth,\n\nI hope this e-meow finds you pawsitively purrfect! I wanted to furr-low up regarding the purr-ject purrr-oposal I submitted last week fur the "Urban Development Initiati-paw." I would greatly appurr-ciate it if you could purr-vide any feedback or let meow know if there are any additional de-tails required.\n\nAdditionally, if you have any questions or need furrr-ther claw-rification on any aspect of the purrr-oposal, please do not hesitate to reach out. I am meow than happy to purr-vide furrr-ther infur-mation to ensure all your concerns are cat-dressed.\n\nThank mew fur your time and consideration. I look fur-ward to your response.\n\nBest re-purr-gards,\n\nJessica Tail-or\nPurr-ject Manager\nTail-or & Co.',
      },
      {
        text: "email: Dear Valued Customer,\n\nWe are excited to announce the launch of our new fall collection at Taylor & Co.! Our designers have been hard at work creating a range of stylish, comfortable, and high-quality clothing that we know you will love.\n\nTo celebrate this launch, we are offering an exclusive 20% discount on all new arrivals. Simply use the code FALL20 at checkout to enjoy this limited-time offer. Don't miss out on the chance to update your wardrobe with the latest trends.\n\nVisit our website today to explore the new collection and take advantage of this fantastic deal. We look forward to seeing you soon!\n\nWarm regards,\nThe Taylor & Co. Team",
      },
      {
        text: "cat speak version: Dear Valued Fur-iend,\n\nWe are absolutely hiss-terical with excitement to announce the launch of our brand mew fall collurction at Tail-or & Co.! Our de-sign-ers have been hard at purr, creating a range of claw-some, comfurtable, and high-quality clothing that we know you'll paw-sitively love!\n\nTo celebrate this launch, we're offering an exclusive 20% discount on all mew arr-furr-vals! Simply use the code MEOW20 at checkout to enjoy this limited-time purrmotion. Don’t miss out on the oppurrtunity to up-cat your wardrobe with the latest furrends!\n\nPounce over to our website today to ex-paw-lore the mew collurction and take advantage of this ameowzing deal. We look fur-ward to seeing you soon!\n\nPurrs and Whisker Wishes,\nThe Tail-or & Co. Team",
      },
      {
        text: "email: Dear John Doe,\n\nWe detected a new sign-in to your Google Account on a new device.\n\nDetails:\n- Device: Windows PC\n- Location: New York, USA\n- Time: August 26, 2024, 10:15 AM (UTC)\n\nIf this was you, you don’t need to do anything. If you did not sign in from this device, we recommend that you review your account security settings immediately.\n\nTo secure your account, you can:\n- Change your password.\n- Enable two-step verification.\n- Review your account activity.\n- Visit your Google Account Security Page for more information.\n\nThank you for helping keep your account safe.\n\nBest regards,\n\nThe Google Security Team",
      },
      {
        text: "cat speak version: Dear John Doe,\n\nWe've detected a mew sign-in to your Grrr-oogle Account on a furresh device! \n\n🐾De-tails:\n- Device: Windows PawC\n- Location: Mew York, USA\n- Time: August 26, 2024, 10:15 AM (UTC)\n\nIf this was you, you don't need to lift a paw. If you didn’t purrform this sign-in, we highly recommend that you purr-tect your account right meow!\n\nTo secure your account, you can:\n- Change your paw-ssword.\n- Enable two-step fur-rification.\n- Review your account cat-tivity.\n- Visit your Grrr-oogle Account Security Page fur more infur-mation.\n\nThank you fur helping keep your account safe and sound!\n\nWhisker regards,\n\nThe Grrr-oogle Security Team",
      },
      { text: `email: ${body.emailBody}` },
      { text: "cat speak version: " },
    ];

    const result = await model.generateContent({
      contents: [{ role: "user", parts }],
      generationConfig,
      // safetySettings: Adjust safety settings
      // See https://ai.google.dev/gemini-api/docs/safety-settings
    });

    return NextResponse.json({ purrifiedEmail: result.response.text() });
  } catch (error) {
    let msg = "Something went wrong";
    if (error instanceof Error) msg = error.message;
    return NextResponse.json({ error: msg }, { status: 401 });
  }

  return NextResponse.json({});
}
