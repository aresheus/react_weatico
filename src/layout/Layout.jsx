import MainLayout from "./MainLayout";
import Loading from "../components/Loading/Loading";
import "../styles/Layout.css";
import NotFoundCity from "../components/NotFoundCity/NotFoundCity";

import getWeatherByCountry from "../service/api/weatherApi";
import getCurrentCity from "../service/api/getCurrentCity";
import { useEffect } from "react";
import { WeatherContext, useContext } from "../context/weatherContext";

export default function Layout() {
  const {
    currentCity,
    setCurentCity,
    setTodayWeather,
    setGeoLoc,
    setWeatherHourly,
    loaded,
    setLoaded,
    showNF,
    setShowNF,
  } = useContext(WeatherContext);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      async ({ coords: { latitude, longitude } }) => {
        const city = await getCurrentCity(latitude, longitude);
        setCurentCity(city);
      },
      () => {
        setCurentCity("Baku");
      }
    );
  }, []);

  useEffect(() => {
    setLoaded(false);

    getWeatherByCountry(currentCity)
      .then((data) => {
        const {
          current,
          forecast: { forecastday },
          location: { country, name, localtime, lat, lon },
        } = data[0];

        setTodayWeather({
          country,
          name,
          localtime,
          current,
          lat,
          lon,
          imageUrl: data[1],
        });
        setGeoLoc({ lat, lon, name });
        setWeatherHourly({ forecastday });
      })
      .catch(() => {
        setShowNF(true);

        setTimeout(() => {
          setShowNF(false);
        }, 1000);
      })
      .finally(() => {
        setLoaded(true);
      });
  }, [currentCity]);

  return (
    <>
      {loaded ? (
        <main className="Layout">
          <MainLayout />
          {showNF ? <NotFoundCity /> : <></>}
        </main>
      ) : (
        <Loading />
      )}
    </>
  );
}
