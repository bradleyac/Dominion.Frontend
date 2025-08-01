import { type HubConnection, HubConnectionBuilder } from "@microsoft/signalr";
import { CardInstance, GameState } from "../features/board/boardSlice";
import { Game } from "../features/gameList/GameList";

const URL = import.meta.env.VITE_SERVER_URL;

export class SignalrConnector {
  private connection: HubConnection;
  public gameListEvents: ({
    onGameCreated,
  }: {
    onGameCreated: (payload: Game) => void;
  }) => () => void;
  public gameEvents: ({
    onStateUpdated,
  }: {
    onStateUpdated: (payload: any) => void;
  }) => () => void;
  // TODO: Should this really be a singleton, or do I want different connections in different places?
  static instance: SignalrConnector;
  constructor(idToken: string) {
    this.connection = new HubConnectionBuilder()
      .withUrl(URL, { accessTokenFactory: () => idToken })
      .withAutomaticReconnect()
      .build();
    this.connection.start().catch(err => console.log(err));
    this.gameListEvents = ({ onGameCreated }) => {
      this.connection.on("gameCreated", payload => {
        console.log(payload);
        onGameCreated(payload);
      });
      return () => {
        this.connection.off("gameCreated");
      };
    };
    this.gameEvents = ({ onStateUpdated }) => {
      this.connection.on("stateUpdated", payload => {
        console.log(payload);
        onStateUpdated(payload);
      });
      return () => {
        this.connection.off("stateUpdated");
      };
    };
  }
  public listGames = async (): Promise<Game[]> => {
    return await this.connection.invoke("getAllGamesAsync");
  };
  public createGame = async (): Promise<{ gameId: string }> => {
    const gameId = await this.connection.invoke<string>("createGameAsync");
    return { gameId };
  };
  public joinGame = async (gameId: string): Promise<boolean> => {
    const joined: boolean = await this.connection.invoke("joinGameAsync", gameId);
    return joined;
  };
  public abandonGame = async (gameId: string): Promise<void> => {
    await this.connection.invoke("abandonGameAsync", gameId);
  }
  public retrieveGameState = async (
    gameId: string,
  ): Promise<GameState | undefined> => {
    try {
      const newState = await this.connection.invoke<GameState>(
        "getGameStateAsync",
        gameId,
      );
      return newState;
    } catch (ex) {
      console.log(ex);
    }
  };
  public endTurn = async (gameId: string): Promise<void> => {
    await this.connection.invoke<any>("endTurnAsync", gameId);
  };
  public endActionPhase = async (gameId: string): Promise<void> => {
    await this.connection.invoke<any>("endActionPhaseAsync", gameId);
  };
  public playCard = async (
    gameId: string,
    cardInstanceId: string,
  ): Promise<void> => {
    await this.connection.invoke<any>("playCardAsync", gameId, cardInstanceId);
  };
  public buyCard = async (gameId: string, cardId: number): Promise<void> => {
    await this.connection.invoke<any>("buyCardAsync", gameId, cardId);
  };
  public chooseCards = async (
    gameId: string,
    choiceId: string,
    selectedCards: (string | number)[],
  ) => {
    if (typeof selectedCards[0] === "number") {
      await this.connection.invoke<any>(
        "submitCardChoicesAsync",
        gameId,
        choiceId,
        selectedCards,
      );
    } else {
      await this.connection.invoke<any>(
        "submitCardInstanceChoicesAsync",
        gameId,
        choiceId,
        selectedCards,
      );
    }
  };
  public categorizeCards = async (
    gameId: string,
    choiceId: string,
    categorizedCards: Record<string, string[]>,
  ): Promise<void> => {
    await this.connection.invoke<any>(
      "submitCategorizationAsync",
      gameId,
      choiceId,
      categorizedCards,
    );
  };
  public arrangeCards = async (
    gameId: string,
    choiceId: string,
    arrangedCards: CardInstance[],
  ): Promise<void> => {
    await this.connection.invoke<any>(
      "submitCardInstanceChoicesAsync",
      gameId,
      choiceId,
      arrangedCards.map(card => card.instanceId),
    );
  };
  public declineChoice = async (
    gameId: string,
    choiceId: string,
  ): Promise<void> => {
    await this.connection.invoke<any>("declineChoiceAsync", gameId, choiceId);
  };
  public undo = async (gameId: string) => {
    await this.connection.invoke<any>("undoAsync", gameId);
  };
  public static getInstance(authHeader: string): SignalrConnector {
    if (!SignalrConnector.instance)
      SignalrConnector.instance = new SignalrConnector(authHeader);
    return SignalrConnector.instance;
  }
}
export default SignalrConnector.getInstance;
