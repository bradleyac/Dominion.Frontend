import { createContext } from "react";
import { SignalrConnector } from "./signalrConnection";

export const SignalrContext = createContext<SignalrConnector | null>(null);