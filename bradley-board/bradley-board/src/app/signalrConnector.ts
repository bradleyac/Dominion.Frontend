import { type HubConnection, HubConnectionBuilder } from "@microsoft/signalr";
import { CardInstance, GameState } from "../features/board/boardSlice";
const URL = "http://192.168.4.90:5128/gameHub";
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
    return { gameId, playerId };
  }
  public joinGame = async (gameId: string): Promise<{ gameId: string, playerId: string }> => {
    const playerId = "Earl";
    await this.connection.invoke("joinGameAsync", gameId, playerId);
    return { gameId, playerId };
  }
  public retrieveGameState = async (gameId: string, playerId: string): Promise<GameState | undefined> => {
    try {
      const newState = await this.connection.invoke<GameState>("getGameStateAsync", gameId, playerId);
      return newState;
    }
    catch (ex) {
      console.log(ex);
    }
  }
  public endTurn = async (gameId: string, playerId: string): Promise<void> => {
    await this.connection.invoke<any>("endTurnAsync", gameId, playerId);
  }
  public endActionPhase = async (gameId: string, playerId: string): Promise<void> => {
    await this.connection.invoke<any>("endActionPhaseAsync", gameId, playerId);
  }
  public playCard = async (gameId: string, playerId: string, cardInstanceId: string): Promise<void> => {
    await this.connection.invoke<any>("playCardAsync", gameId, playerId, cardInstanceId)
  }
  public buyCard = async (gameId: string, playerId: string, cardId: number): Promise<void> => {
    await this.connection.invoke<any>("buyCardAsync", gameId, playerId, cardId);
  }
  public chooseCards = async (gameId: string, playerId: string, choiceId: string, selectedCards: (string | number)[]) => {
    if (typeof selectedCards[0] === "number") {
      await this.connection.invoke<any>("submitCardChoicesAsync", gameId, playerId, choiceId, selectedCards);
    }
    else {
      await this.connection.invoke<any>("submitCardInstanceChoicesAsync", gameId, playerId, choiceId, selectedCards);
    }
  }
  public categorizeCards = async (gameId: string, playerId: string, choiceId: string, categorizedCards: Record<string, string[]>): Promise<void> => {
    await this.connection.invoke<any>("submitCategorizationAsync", gameId, playerId, choiceId, categorizedCards);
  }
  public arrangeCards = async (gameId: string, playerId: string, choiceId: string, arrangedCards: CardInstance[]): Promise<void> => {
    await this.connection.invoke<any>("submitCardInstanceChoicesAsync", gameId, playerId, choiceId, arrangedCards.map(card => card.instanceId))
  }
  public declineChoice = async (gameId: string, playerId: string, choiceId: string): Promise<void> => {
    await this.connection.invoke<any>("declineChoiceAsync", gameId, playerId, choiceId);
  }
  public undo = async (gameId: string, playerId: string) => {
    await this.connection.invoke<any>("undoAsync", gameId, playerId);
  }
  public static getInstance(): SignalrConnector {
    if (!SignalrConnector.instance)
      SignalrConnector.instance = new SignalrConnector();
    return SignalrConnector.instance;
  }
}
export default SignalrConnector.getInstance;