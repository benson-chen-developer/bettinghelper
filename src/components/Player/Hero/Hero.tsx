import React, { Dispatch, SetStateAction, useContext, useEffect, useState } from "react";
import { StatBtn } from "../StatBtn";
import { useParams } from 'react-router-dom';
import { Action, fillStats, Game, Game2 } from "../../../functions/players";
import { PlayersContext } from "../../../Context";

type Props = {
    games: Game2[],
    setGames: Dispatch<SetStateAction<Game2[]>>;
}
  

export const Hero: React.FC<Props> = ({games, setGames}) => {
    const { paramName, paramLeague } = useParams<{ paramName: string, paramLeague: string }>();
    const [pickedBtn, setPickedBtn] = useState<string>('Whole Game')
    const players = useContext(PlayersContext);

    const periodSort = (period: string) => {
        let parsedParamName = `${paramName?.split("_")[0]}. ${paramName?.split("_")[1]}`
        setPickedBtn(period)

        let newGames: any = [];
        games.forEach((game: any) => {
          newGames.push({
            ...game,
            stats: fillStats(parsedParamName, period, game.actions)
          })
        })
    
        setGames(newGames);
    }
    const currPlayer = players?.find(player => 
        `${player.firstName[0]}_${player.lastName}`.toLowerCase() === paramName?.toLowerCase()
    )

    return <div style={{
        width:'100%', height: "370px", background: '#1D1D1D',
        display:'flex', justifyContent:'flex-end',
        flexDirection:'column', paddingLeft: '75px'
    }}>

        <div style={{
            width:'100%', height:'300px', display:'flex', alignItems:'flex-end'
        }}>
            {/* Player name */}
            <div style={{display:'flex', alignItems:'flex-end'}}>
                <div style={{
                    width: '120px', 
                    height: '120px', 
                    background: '#fff', 
                    borderRadius: '50%', 
                    display: 'flex', overflow:'hidden',
                    justifyContent: 'center', alignItems: 'flex-end'
                }}>
                    <img 
                        src={`https://cdn.wnba.com/headshots/wnba/latest/1040x760/${currPlayer?.picId}.png`}
                        style={{width: '150px', height: '110px'}}
                    />
                </div>

                <div style={{marginLeft:'50px', height:'100px', display:'flex', flexDirection:'column'}}>
                    <h1 style={{color:'#fff', fontSize: 50, margin: 0}}>
                        {currPlayer?.firstName} {currPlayer?.lastName}
                    </h1>
                    <h1 style={{color:'#ccc9c9', fontSize: 25}}>
                        #{currPlayer?.number} - {currPlayer?.city} {currPlayer?.team} - {currPlayer?.position}
                    </h1>
                </div>
            </div>
        </div>

        <div style={{
            display:'flex', flexDirection:'column', justifyContent:'space-between'
        }}>
            <h2 style={{color:'#fff'}}>{pickedBtn}</h2>
            <div style={{display:'flex', marginBottom: '20px'}}>
                <StatBtn text={"Whole Game"} onClick={() => periodSort("Whole Game")} pickedBtn={pickedBtn}/>
                <StatBtn text={"1st Half"} onClick={() => periodSort("1st Half")} pickedBtn={pickedBtn}/>
                <StatBtn text={"2nd Half"} onClick={() => periodSort("2nd Half")} pickedBtn={pickedBtn}/>
                <StatBtn text={"1st Quarter"} onClick={() => periodSort("1st Quarter")} pickedBtn={pickedBtn}/>
                <StatBtn text={"2nd Quarter"} onClick={() => periodSort("2nd Quarter")} pickedBtn={pickedBtn}/>
                <StatBtn text={"3rd Quarter"} onClick={() => periodSort("3rd Quarter")} pickedBtn={pickedBtn}/>
                <StatBtn text={"4th Quarter"} onClick={() => periodSort("4th Quarter")} pickedBtn={pickedBtn}/>
            </div>
        </div>
    </div>
}