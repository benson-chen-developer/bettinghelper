import { createContext } from "react";
import { Game } from "./functions/players";

export type PlayerType = {
    picId: number,
    lastName: string,
    firstName: string,
    city: string,
    team: string,
    abbr: string,
    position: string,
    number: string,
    ppg: number,
    rpg: number,
    apg: number
}

export const PlayersContext = createContext<PlayerType[] | undefined>(undefined); 