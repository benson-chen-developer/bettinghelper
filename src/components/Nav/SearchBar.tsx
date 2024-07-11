import React, { useState, FormEvent, Dispatch, SetStateAction } from 'react';
import { useNavigate } from 'react-router-dom';
import { InputField } from './InputField';
import { NamesDropDown } from './NamesDropDown';

interface Props {
  widthSpacing?: string,
  marginLeftSpacing?: string
}

/* Navigates to new page while appending the new player name to the end */
export const searchPlayer = (input: string, league: string) => {
  let parsedName = input.trim(); // Remove whitespace
  parsedName = parsedName.toLowerCase(); // Convert to lowercase
  let nameParts = parsedName.split(' '); // Split the name

  if (nameParts.length >= 2) { // Basically turn Cait Clark to C_Clark
    let firstName = nameParts[0];
    let lastName = nameParts[1];
    parsedName = `${firstName.charAt(0)}_${lastName}`;
  }

  if (input.trim()) {
    // navigate(`/player/${sport}/${parsedName.trim()}`);
    window.open(`/player/${league}/${parsedName.trim()}`, '_blank', 'noopener,noreferrer');
  }
};


export const SearchBar: React.FC<Props> = ({widthSpacing, marginLeftSpacing}) => {
  const [playerName, setPlayerName] = useState<string>('');
  const [sport, setSport] = useState<string>('WNBA');
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPlayerName(e.target.value);
  };
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    searchPlayer(playerName, sport);
  };


  return (
    <div style={{
      display:'flex', flexDirection:'column', 
      width: widthSpacing ? widthSpacing : '30%',
      marginLeft: marginLeftSpacing ? marginLeftSpacing : 30,
      position: 'relative'
    }}>
      
      <form onSubmit={handleSubmit} style={{ 
        display: 'flex', background:'#fff', 
        width: "100%",
        borderRadius: 10,border: '2px solid #000', alignItems:'center',
        justifyContent:'space-between'
      }}>
        <div style={{display:'flex', width:'70%'}}>

          {/* The Magnifying Glass icon */}
          <button type="submit" style={{
              border: 'none', background: 'none', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="30px"
              height="30px"
              viewBox="0 0 24 24"
              fill="#000"
              style={{pointerEvents: 'none', color: '#888484'}}
            >
              <path d="m19.6 21l-6.3-6.3q-.75.6-1.725.95T9.5 16q-2.725 0-4.612-1.888T3 9.5t1.888-4.612T9.5 3t4.613 1.888T16 9.5q0 1.1-.35 2.075T14.7 13.3l6.3 6.3zM9.5 14q1.875 0 3.188-1.312T14 9.5t-1.312-3.187T9.5 5T6.313 6.313T5 9.5t1.313 3.188T9.5 14" />
            </svg>
          </button>

          <InputField value={playerName} handleInputChange={handleInputChange}/>
        </div>

        {/* League Drop Down */}
        <SportBtn sport={sport} setSport={setSport}/>
      </form>

      <NamesDropDown 
        input={playerName}
      />

    </div>
  );
};


interface SportBtnProps {
  sport: string, 
  setSport: Dispatch<SetStateAction<string>>
}
const SportBtn: React.FC<SportBtnProps> = ({ sport, setSport }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const allSports = [
    "WNBA"
  ]

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };
  const handleSportSelect = (sport: string) => {
    setSport(sport);
    setIsDropdownOpen(false);
  };

  return (
    <div style={{ position: 'relative', width:'20%' }}>
      
      {/*  */}
      <button 
        onClick={toggleDropdown} 
        style={{
          width: '95%', height: "90%", borderRadius: 10,
          background: '#000',
          border: 'none',
          display: 'flex', justifyContent: 'center', alignItems: 'center',
          margin: 3, cursor: 'pointer'
        }} type="button"
      >
        <p style={{ color: '#fff', fontSize: 12, fontWeight: 'bold' }}>
          {sport}
        </p>
      </button>

      {/* The League Drop Down */}
      {isDropdownOpen && (
        <div style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          backgroundColor: '#fff',
          border: '1px solid #ddd',
          borderRadius: 5,
          width: '100%',
          boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)',
          zIndex: 1
        }}>
          {allSports.map((sportName, index) => { return <div key={index}
              onClick={() => handleSportSelect(sportName)} 
              style={{ padding: 10, cursor: 'pointer', backgroundColor: sport === sportName ? '#f0f0f0' : '#fff' }}
            >
              {sportName}
            </div>
          })}
        </div>
      )}
    </div>
  );
}