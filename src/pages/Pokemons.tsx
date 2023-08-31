import { Typography } from "@mui/material";
import { useLayoutEffect, useState } from "react";
import { useQuery } from "react-query";
import AutoSizer from "react-virtualized-auto-sizer";
import { FixedSizeGrid as GridList } from "react-window";
import Card from "../components/Card";
import Navbar from "../components/Navbar";
import SkeletonCard from "../components/SkeletonCard";
import { fetchPokemons } from "../lib/axios/api";
import { useSearchStore } from "../state/store";


function Pokemons() {
  const [columns, setColumns] = useState(() =>
    Math.floor(window.innerWidth / 350)
  );
  const searchStore = useSearchStore();
  //searchStore.setSearch("");
  const { data, status, error } = useQuery<TPokemons[], Error>("pokemons", () =>
    //skeleton test
    fetchPokemons()
  );
  const dataFiltered = data?.filter((pokemon) =>
    pokemon.name.includes(searchStore.search)
  );

  useLayoutEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 600) {
        setColumns(1);
      } else if (window.innerWidth < 960) {
        setColumns(2);
      } else if (window.innerWidth < 1280) {
        setColumns(3);
      } else {
        setColumns(4);
      }
    };

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const renderItem = ({ columnIndex, rowIndex, style }: any) => {
    const index = rowIndex * columns + columnIndex;
    const pokemon = dataFiltered?.[index];

    if (!pokemon) return <SkeletonCard style={style} />;

    return <Card key={pokemon.name} pokemon={pokemon} style={style} />;
  };

  return (
    <div style={{ backgroundColor: "#f8f8f8", height: "100vh", padding: 16 }}>
      <Navbar />
      <Typography
        variant="h1"
        component="h1"
        align="center"
        fontSize={32}
        gutterBottom
      >
        Pokemons
      </Typography>

    
      {status === "error" && (
        <Typography variant="h2" component="h2" align="center">
          {error.message}
        </Typography>
      )}

      {dataFiltered?.length === 0 && (
        <Typography variant="h2" component="h2" align="center">
          No results
        </Typography>
      )}

      <AutoSizer style={{ width: "100%", height: "100vh" }}>
        {({ height, width }: { height: number; width: number }) => {
          const totalItems = dataFiltered?.length || 0;

          return (
            <GridList
              height={height}
              width={width}
              columnCount={columns}
              columnWidth={width / columns}
              rowCount={Math.ceil(totalItems / columns)}
              rowHeight={100}
            >
              {renderItem}
            </GridList>
          );
        }}
      </AutoSizer>
    </div>
  );
}

export default Pokemons;
