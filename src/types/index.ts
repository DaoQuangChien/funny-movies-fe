export interface iUser {
  id: string;
  email: string;
  accessToken: string;
}

export interface iState {
  userData: iUser | null;
  isSignIn: boolean;
}

export enum eAction {
  SIGN_IN = "signin",
  SIGN_OUT = "signout",
}

export type Action =
  | {
      type: eAction.SIGN_IN;
      payload: {
        userData: iUser;
      };
    }
  | {
      type: eAction.SIGN_OUT;
    };

export interface iSignInParams {
  url: string;
  email: string;
  password: string;
}

export interface iAuthenActions extends iState {
  signIn: (params: iSignInParams) => Promise<void>;
  signOut: () => void;
}

interface iMovieUser {
  _id: string;
  email: string;
}

export interface iMovie {
  _id: string;
  title: string;
  movieUrlId: string;
  description: string;
  user: iMovieUser;
  upVotes: iMovieUser[];
  downVotes: iMovieUser[];
  createdAt: string;
  updatedAt: string;
}

export interface iMovieItem extends iMovie {
  upVoteAmount: number;
  downVoteAmount: number;
  upVoted: boolean;
  downVoted: boolean;
  isVoted: boolean;
}
