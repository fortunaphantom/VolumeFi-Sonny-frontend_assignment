import type { NextPage } from 'next';
import { SwapBox } from 'components/SwapBox';

const Home: NextPage = () => {
  return (
    <div className="home-page">
      <SwapBox />
    </div>
  );
};

export default Home;
