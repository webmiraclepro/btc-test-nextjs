import type { NextPage } from 'next';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useWeb3React } from '@web3-react/core';
import { Card, Button, Spinner, Badge, Label, Radio } from 'flowbite-react';
import type { RootState, AppDispatch } from 'app/store';
import {
  setAddress,
  fetchBTCPrice,
  fetchScore,
  takeUpOption,
  takeDownOption,
  confirmOption,
} from 'app/store/app.slice';
import { formatWalletAddress } from 'app/helpers/utils';
import { STATE_DATA, RATING_STATE, INTERVAL } from 'app/helpers/constants';
import { Injected } from 'app/helpers/wallets';

const Home: NextPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { activate, deactivate, account, active } = useWeb3React();
  const { address, score, price, rating, option, cofirmed } = useSelector(
    ({ app }: RootState) => app,
  );
  const [timer, setTimer] = useState(0);

  useEffect(() => {
    dispatch(fetchBTCPrice(false));

    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    const interval = setInterval(handleTimer, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    dispatch(fetchScore());

    // eslint-disable-next-line
  }, [address]);

  useEffect(() => {
    dispatch(setAddress(active ? account : ''));

    // eslint-disable-next-line
  }, [active]);

  useEffect(() => {
    if (timer > INTERVAL) {
      dispatch(fetchBTCPrice(true));
      setTimer(0);
    }

    // eslint-disable-next-line
  }, [timer]);

  const handleTimer = () => {
    setTimer((timer) => timer + 1);
  };

  const handleWallet = () => {
    if (!!address) {
      deactivate();
    } else {
      activate(Injected);
    }
  };

  const handleChangeOption = (e: React.ChangeEvent<HTMLInputElement>) => {
    switch (e.target.name) {
      case 'up':
        dispatch(takeUpOption());
        break;
      case 'down':
        dispatch(takeDownOption());
        break;
    }
  };

  const handleConfirm = () => {
    dispatch(confirmOption());
  };

  return (
    <div className="flex items-center justify-center mt-20">
      <Card>
        <div className="flex flex-col items-center">
          <div className="mb-4">
            <Button onClick={handleWallet}>
              {!!address
                ? `Connected from ${formatWalletAddress(address)}`
                : 'Connect Wallet'}
            </Button>
          </div>

          <h1 className="mb-4 text-6xl font-extrabold tracking-tight leading-none text-gray-900">
            {!!address && score !== null ? score : '-'}
          </h1>

          <div className="flex items-center mb-6">
            <p className="text-2xl font-normal text-gray-500 mr-2">$ {price}</p>
            <Badge size="sm" color={STATE_DATA[rating].color}>
              {STATE_DATA[rating].icon}
            </Badge>
          </div>

          <fieldset className="flex gap-4 mb-1">
            <div className="flex items-center gap-2">
              <Radio
                name="down"
                checked={option === RATING_STATE.down}
                onChange={handleChangeOption}
                disabled={cofirmed}
              />
              <Label htmlFor="down">Down</Label>
            </div>

            <div className="flex items-center gap-2">
              <Radio
                name="up"
                checked={option === RATING_STATE.up}
                onChange={handleChangeOption}
                disabled={cofirmed}
              />
              <Label htmlFor="up">Up</Label>
            </div>

            <Button size="xs" onClick={handleConfirm} disabled={cofirmed}>
              Confirm
            </Button>
          </fieldset>

          <div className="flex item-center">
            <div className="mr-2">
              <Spinner />
            </div>
            <p>
              Please wait for <span className="font-bold">{60 - timer}</span>{' '}
              seoncds...
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Home;
