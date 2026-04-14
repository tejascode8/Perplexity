import { tavily as Tavily } from "@tavily/core";

const travily = Tavily({
  apiKey: process.env.TRAVILY_API_KEY,
});

export const searchInternet = async ({ query }) => {
  const result = await travily.search(query, {
    maxResults: 5,
  });

  console.log(JSON.stringify(result));

  return JSON.stringify(result);
};
