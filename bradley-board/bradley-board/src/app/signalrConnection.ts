import { type HubConnection, HubConnectionBuilder } from "@microsoft/signalr";
const URL = "http://localhost:5128/gameHub";
export class SignalrConnector {
  private connection: HubConnection;
  public gameListEvents: ({ onGameCreated }: {
    onGameCreated: (payload: string) => void,
  }) => (() => void);
  public gameEvents: ({ onStateUpdated }: {
    onStateUpdated: (payload: any) => void,
  }) => (() => void);
  // TODO: Should this really be a singleton, or do I want different connections in different places?
  static instance: SignalrConnector;
  constructor() {
    this.connection = new HubConnectionBuilder()
      .withUrl(URL)
      .withAutomaticReconnect()
      .build();
    this.connection.start().catch(err => console.log(err));
    this.gameListEvents = ({ onGameCreated }) => {
      this.connection.on("gameCreated", (payload) => {
        console.log(payload);
        onGameCreated(payload as string);
      });
      return () => { this.connection.off("gameCreated"); }
    };
    this.gameEvents = ({ onStateUpdated }) => {
      this.connection.on("stateUpdated", (payload) => {
        console.log(payload);
        onStateUpdated(payload);
      })
      return () => { this.connection.off("stateUpdated"); }
    };
  }
  public listGames = async (): Promise<string[]> => {
    return await this.connection.invoke("getAllGamesAsync")
  }
  public createGame = async (): Promise<{ gameId: string, playerId: string }> => {
    const playerId = "Sinclair";
    const gameId = await this.connection.invoke<string>("createGameAsync", playerId)
    const gameState = await this.connection.invoke<any>("getGameStateAsync", gameId, playerId);
    console.log(gameState);
    return { gameId, playerId };
  }
  public joinGame = async (gameId: string): Promise<{ gameId: string, playerId: string }> => {
    const playerId = "Earl";
    await this.connection.invoke("joinGameAsync", gameId, playerId);
    const gameState = await this.connection.invoke<any>("getGameStateAsync", gameId, playerId);
    console.log(gameState);

    return { gameId, playerId };
  }
  public retrieveGameState = async (gameId: string, playerId: string): Promise<any> => {
    try {
      const newState = await this.connection.invoke<any>("getGameStateAsync", gameId, playerId);
      console.log(newState);
      return newState;
    }
    catch (ex) {
      console.log(ex);
    }
  }
  // public playCard = async (gameId: string, cardId: string)
  // public playCopper = () => {
  //   this.connection.send("playCardAsync", "foo", messages).then(x => console.log("sent"))
  // }
  public static getInstance(): SignalrConnector {
    if (!SignalrConnector.instance)
      SignalrConnector.instance = new SignalrConnector();
    return SignalrConnector.instance;
  }
}
export default SignalrConnector.getInstance;