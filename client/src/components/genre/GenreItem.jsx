// GenreItem.jsx

import styled from 'styled-components';
import PropTypes from "prop-types";
import { useEffect, useState } from 'react';
import { makeRequest, apiURL } from '../../axios';  // Adjust the import statements

import { API_KEY } from '../../Api_key';
import { BsStar } from 'react-icons/bs';
import { Link } from 'react-router-dom';
import { StarRating } from "../common";

const GenreItem = ({ gameItem }) => {
  const [gameData, setGameData] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await makeRequest.get(`${apiURL.gamesURL}/${gameItem.id}?${API_KEY}`);  // Use makeRequest
      setGameData(data);
    }

    fetchData();
  }, []);

  return (
    <GenreItemWrapper className='card'>
      {/* ... rest of your code */}
    </GenreItemWrapper>
  )
}

export default GenreItem;

GenreItem.propTypes = {
  gameItem: PropTypes.object
}

const GenreItemWrapper = styled.div`

    display: flex;
  flex-direction: column;

  .card-top{
    height: 280px;
    overflow: hidden;
    position: relative;
    background: linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.27) 92.08%);
    position: relative;

    &::after{
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 1));
    }

    .ratings-count{
      position: absolute;
      left: 18px;
      bottom: 10px;
      font-weight: 700;
      font-size: 14px;
      padding: 0px 12px;
      border-radius: 16px;
      background-color: var(--clr-white);
      z-index: 1;
    }
  }

  .card-bottom{
    flex: 1;
    background-color: var(--clr-violet-light);
    padding: 20px 18px;

    .card-title{
      font-size: 18px;
      font-weight: 800px;
      font-family: var(--font-family-poppins)!important;
      letter-spacing: 0.06em;
      margin-bottom: 10px;
    }

    .card-button{
      height: 34px;
      text-align: center;
      border: 1px solid var(--clr-green-normal);
      padding: 0px 16px;
      min-width: 108px;
      color: var(--clr-white);
      font-weight: 600;
      letter-spacing: 0.03em;
      display: inline-flex;
      align-items: center;
      transition: var(--transition-default);

      &:hover{
        background-color: var(--clr-green-normal);
      }
    }
  }

  .details-group{
    padding-top: 12px;
    color: rgba(255, 255, 255, 0.6);
    font-size: 14px;
  }
`;