interface StormGlassPointSource {
  [key: string]: number;
}

export interface StormGlassForecastResponse {
  hours: [
    {
      time: string;
      swellDirection: StormGlassPointSource;
      swellHeight: StormGlassPointSource;
      swellPeriod: StormGlassPointSource;
      waveDirection: StormGlassPointSource;
      waveHeight: StormGlassPointSource;
      windDirection: StormGlassPointSource;
      windSpeed: StormGlassPointSource;
    }
  ];
}

export interface ForecastPoint {
  swellDirection: number;
  swellHeight: number;
  swellPeriod: number;
  time: string;
  waveDirection: number;
  waveHeight: number;
  windDirection: number;
  windSpeed: number;
}

export interface StormGlassValidatePoint {
  time: string;
  swellDirection: StormGlassPointSource;
  swellHeight: StormGlassPointSource;
  swellPeriod: StormGlassPointSource;
  waveDirection: StormGlassPointSource;
  waveHeight: StormGlassPointSource;
  windDirection: StormGlassPointSource;
  windSpeed: StormGlassPointSource;
}
