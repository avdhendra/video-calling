import { GetServerSidePropsContext, GetServerSidePropsResult } from "next";

import { createToken, decodeToken } from "../helpers/jwt";
import type { User } from "@stream-io/video-react-sdk";

export type ServerSideCredentialsProps = {
  user: User;
  userToken: string;
  apiKey: string;
  callId: string;
  searchParams: Record<string, string>
};

type QueryParams = {
  api_key?: string;
  token?: string;
  user_id?: string;
};

// export const getServerSideCredentialsProps = async (
//   context: GetServerSidePropsContext
// ): Promise<GetServerSidePropsResult<ServerSideCredentialsProps>> => {
 

 
//   const apiKey = process.env.STREAM_API_KEY as string;
//   const secretKey = process.env.STREAM_SECRET_KEY as string;
 

//  // Otherwise, SDP parse errors with MSID

//   // Chat does not allow for Id's to include special characters
//   const streamUserId =
//     "video-tutorial-" + Math.random().toString(16).substring(2);
  

//   const token = createToken(streamUserId, apiKey, secretKey);
//   return {
//     props: {
//       apiKey,
//       userToken: token,
//       user: {
//         id: streamUserId,
//         name: "Oliver",
//         image: "https://getstream.io/random_svg/?id=oliver&name=Oliver",
//       },
//     },
//   };
// };
