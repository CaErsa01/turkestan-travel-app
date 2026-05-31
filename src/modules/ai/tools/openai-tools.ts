export type OpenAiTool = {
  type: "function";
  function: {
    name: string;
    description: string;
    parameters: Record<string, unknown>;
  };
};

export const AI_OPENAI_TOOLS: OpenAiTool[] = [
  {
    type: "function",
    function: {
      name: "search_places",
      description:
        "Search attractions, restaurants, hotels, and other places in the Turkestan app database.",
      parameters: {
        type: "object",
        properties: {
          query: { type: "string", description: "Free-text search in names and descriptions" },
          category: {
            type: "string",
            description:
              "sacred | historical | museum | hotel | restaurant | transport | event | nature | market",
          },
          minRating: { type: "number" },
          limit: { type: "number", description: "Max results, default 8" },
        },
      },
    },
  },
  {
    type: "function",
    function: {
      name: "get_place_details",
      description: "Get full details for a place by its ID including reviews and coordinates.",
      parameters: {
        type: "object",
        properties: { placeId: { type: "string" } },
        required: ["placeId"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "search_routes",
      description: "Search predefined tour routes by duration, preset, tags, or budget.",
      parameters: {
        type: "object",
        properties: {
          preset: {
            type: "string",
            description: "e.g. 1-day, 2-day, historical, family, religious, night, budget",
          },
          maxDurationHours: { type: "number" },
          tags: { type: "array", items: { type: "string" } },
          maxBudgetKzt: { type: "number" },
        },
      },
    },
  },
  {
    type: "function",
    function: {
      name: "get_route_details",
      description: "Get a predefined route with ordered stops, coordinates, and pricing.",
      parameters: {
        type: "object",
        properties: { routeId: { type: "string" } },
        required: ["routeId"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "search_bookings",
      description: "Search hotels, excursions, and guides available for booking.",
      parameters: {
        type: "object",
        properties: {
          type: { type: "string", description: "hotel | excursion | guide" },
          maxPrice: { type: "number", description: "Max price in KZT" },
          minRating: { type: "number" },
          limit: { type: "number" },
        },
      },
    },
  },
  {
    type: "function",
    function: {
      name: "get_official_info",
      description:
        "Get official tourism info: transport, weather, safety, hours, customs, emergency.",
      parameters: {
        type: "object",
        properties: {
          topic: {
            type: "string",
            description: "e.g. transport, weather, safety, hours, customs",
          },
        },
        required: ["topic"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "create_custom_route",
      description:
        "Create a personalized route plan with ordered place IDs. Validates IDs against the database.",
      parameters: {
        type: "object",
        properties: {
          name: { type: "string" },
          stopIds: { type: "array", items: { type: "string" }, description: "Ordered place IDs" },
          durationHours: { type: "number" },
          budgetKzt: { type: "number" },
          transport: { type: "string", description: "Recommended transport modes" },
          explanation: { type: "string", description: "Why this route fits the user" },
        },
        required: ["name", "stopIds", "durationHours", "transport", "explanation"],
      },
    },
  },
];
