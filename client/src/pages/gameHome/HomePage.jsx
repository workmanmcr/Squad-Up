import styled from "styled-components";
import { Banner, ImageSlider, Preloader, Tabs, Title } from "../../components/common/index";
import { useEffect } from "react";
// Assuming you import join_image from your image file
import { fetchAsyncGames } from "../../redux/utils/gameUtils"; // Import only the needed action

const HomePage = () => {
  useEffect(() => {
    fetchAsyncGames(); // Dispatch the action directly without using Redux store
  }, []);

  const renderedPopularGames = (
    <>
      {/* Render popular games */}
    </>
  );

  return (
    <HomeWrapper>
      <Banner />

      <section className="section sc-popular">
        <div className="container">
          <Title titleName={{ firstText: "top popular", secondText: "games" }} />
          {renderedPopularGames}
        </div>
      </section>

      <ImageSlider />

      <section
        className="section sc-join d-flex align-items-center"
        style={{
          background: `linear-gradient(0deg, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), ) center/cover no-repeat`,
        }}
      >
        <div className="container w-100">
          <div className="join-content text-white mx-auto text-center">
            <h2 className="join-title mb-3">
              JOIN THE <span>COMMUNITY</span>
            </h2>
            <p className="lead-text">
              Join our Discord community which is in the making and made by gamers for gamers. All are welcome to join no matter the game you play, we're here to have a good.
            </p>
            <button type="button" className="section-btn mt-4">
              join discord
            </button>
          </div>
        </div>
      </section>

      {/* Other sections... */}
    </HomeWrapper>
  );
};

export default HomePage;

const HomeWrapper = styled.div`
  .sc-popular {
    background-color: var(--clr-violet-dark-active);
    .section-btn {
      margin-top: 60px;
    }
  }

  .sc-join {
    min-height: 640px;

    .join-content {
      max-width: 600px;
    }

    .join-title {
      text-shadow: 0px 4px 4px 0px #00000040;
      font-size: 44px;
      letter-spacing: 0.09em;

      span {
        color: var(--clr-green-normal);
        font-family: var(--font-family-right);
      }
    }
  }

  .sc-genres {
    background-color: var(--clr-violet-dark-active);
  }


`;
