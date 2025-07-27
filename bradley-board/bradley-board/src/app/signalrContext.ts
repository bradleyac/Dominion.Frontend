import { createContext } from "react";
import { SignalrConnector } from "./signalrConnector";

export const SignalrContext = createContext<SignalrConnector | null>(null);
