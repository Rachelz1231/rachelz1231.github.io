import React from "react";
import {
  Box,
  Typography,
  Divider,
  ImageList,
  ImageListItem,
} from "@mui/material";
import { paletteBlackYellow, paletteBlue } from "../../colorPalettle";
// Import all images from ./public/static (Webpack style)
const importAll = (r) =>
  r.keys().map((key, index) => ({
    img: r(key),
    title: key.replace('./', ''),
    cols: index % 6 === 0 ? 2 : 1,
    rows: index % 6 === 0 ? 2 : 1,
  }));

const imageItems = importAll(require.context('./static', false, /\.(png|jpe?g|gif)$/));


/* The More Component */
export default function More() {
  return (
    <Box
      sx={{
        flexGrow: 1,
        zIndex: "-999",
        overflow: "hidden",
        px: "5vw",
        py: "150px",
      }}
    >
      <Typography variant="h2">What else?</Typography>
      <Typography sx={{ fontSize: { xs: "20px", sm: "20px", md: "18px" } }}>
        Welcome to the fun side of my life – the adventures and passions that
        color my world outside the walls of academia and the office!
      </Typography>
      <Divider sx={{ m:1 }}></Divider>
      <Box
        sx={{
          textAlign: "left",
          zIndex: "0",
        }}
      >
        <Typography
          sx={{
            fontSize: { xs: "20px", sm: "20px", md: "20px" },
            paddingX: "5vw",
            paddingBottom: "3vw",
            zIndex: 2,
          }}
        >
          I got into sports two years ago, and I have been active ever since. I
          find snowboarding, running and hiking to be great ways to relax and release stress.
          In May 2023, I finished my first 10k run event in Toronto, and I am
          planning for a half marathon soon!
        </Typography>
        <Typography
          sx={{
            fontSize: { xs: "20px", sm: "20px", md: "20px" },
            paddingX: "5vw",
            paddingBottom: "3vw",
            zIndex: 2,
          }}
        >
          Besides sports, I LOVE traveling and road trips! They fuels my passion
          for exploring nature's wonders, learning about different cultures, and
          embracing new adventures. It's amazing how each journey opens my eyes
          to new ways of life.
        </Typography>
        <ImageList
            sx={{ width: "100%", height: "auto", overflow: "hidden" }}
            variant="quilted"
            cols={4} // more cols gives more room for quilted layout
            rowHeight={200}
          >
            {imageItems.map((item) => (
              <ImageListItem
                key={item.img}
                cols={item.cols}
                rows={item.rows}
                sx={{
                  "& img": {
                    objectFit: "cover",
                    objectPosition: "center",
                    width: "100%",
                    height: "100%",
                  },
                }}
              >
                <img src={item.img} alt={item.title} loading="lazy" />
              </ImageListItem>
            ))}
          </ImageList>
      </Box>
    </Box>
  );
}
