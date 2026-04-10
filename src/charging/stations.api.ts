import { api } from "@/api/api";

const HASURA_GRAPHQL_URL =
  process.env.EXPO_PUBLIC_HASURA_GRAPHQL_URL ??
  "https://hasura-graphql-475046183936.us-central1.run.app/v1/graphql";

const CHARGING_STATIONS_QUERY = `
  query ChargingStationsList(
    $offset: Int
    $limit: Int
    $order_by: [ChargingStations_order_by!]
    $where: ChargingStations_bool_exp
  ) {
    ChargingStations(
      offset: $offset
      limit: $limit
      order_by: $order_by
      where: $where
    ) {
      id
      isOnline
      protocol
      locationId
      createdAt
      updatedAt
      location: Location {
        id
        name
        address
        city
        postalCode
        state
        country
        coordinates
        createdAt
        updatedAt
      }
      LatestStatusNotifications {
        id
        stationId
        statusNotificationId
        updatedAt
        createdAt
        StatusNotification {
          connectorId
          connectorStatus
          createdAt
          evseId
          stationId
          id
          timestamp
          updatedAt
        }
      }
      transactions: Transactions(where: { isActive: { _eq: true } }) {
        id
        timeSpentCharging
        isActive
        chargingState
        stationId
        stoppedReason
        transactionId
        evseId
        remoteStartId
        totalKwh
        createdAt
        updatedAt
      }
      connectors: Connectors {
        connectorId
        status
        errorCode
        timestamp
        info
        vendorId
        vendorErrorCode
        createdAt
        updatedAt
      }
    }
  }
`;

type GeoJsonPoint = {
  coordinates?: [number, number];
};

type ChargingStationRecord = {
  id: string;
  isOnline: boolean;
  protocol: string | null;
  createdAt: string;
  updatedAt: string;
  location: {
    id: number;
    name: string | null;
    address: string | null;
    city: string | null;
    postalCode: string | null;
    state: string | null;
    country: string | null;
    coordinates: GeoJsonPoint | null;
    createdAt: string;
    updatedAt: string;
  } | null;
  transactions: {
    id: number;
    isActive: boolean;
  }[];
  connectors: {
    connectorId: number;
    status: string | null;
    errorCode: string | null;
    timestamp: string | null;
    vendorErrorCode: string | null;
  }[];
};

type ChargingStationsResponse = {
  data: {
    ChargingStations: ChargingStationRecord[];
  };
};

export type ChargingStationMapItem = {
  id: string;
  name: string;
  address: string;
  latitude: number | null;
  longitude: number | null;
  isOnline: boolean;
  isAvailable: boolean;
  availabilityLabel: string;
  connectorSummary: string;
  connectorCount: number;
  protocol: string;
  updatedAt: string;
};

function buildAddress(location: ChargingStationRecord["location"]) {
  if (!location) {
    return "Address unavailable";
  }

  const parts = [
    location.address,
    location.city,
    location.state,
    location.postalCode,
    location.country,
  ].filter(Boolean);

  return parts.length > 0 ? parts.join(", ") : "Address unavailable";
}

function mapStation(station: ChargingStationRecord): ChargingStationMapItem {
  const coordinates = station.location?.coordinates?.coordinates;
  const longitude =
    Array.isArray(coordinates) && coordinates.length >= 2
      ? coordinates[0]
      : null;
  const latitude =
    Array.isArray(coordinates) && coordinates.length >= 2
      ? coordinates[1]
      : null;
  const availableConnectors = station.connectors.filter(
    (connector) => connector.status === "Available",
  ).length;
  const isAvailable = station.isOnline && availableConnectors > 0;
  const connectorSummary =
    station.connectors.length > 0
      ? `${availableConnectors}/${station.connectors.length} available`
      : "No connector data";

  return {
    id: station.id,
    name: station.location?.name?.trim() || station.id,
    address: buildAddress(station.location),
    latitude,
    longitude,
    isOnline: station.isOnline,
    isAvailable,
    availabilityLabel: !station.isOnline
      ? "Offline"
      : isAvailable
        ? "Available"
        : "Unavailable",
    connectorSummary,
    connectorCount: station.connectors.length,
    protocol: station.protocol?.toUpperCase() ?? "Unknown",
    updatedAt: station.updatedAt,
  };
}

export const chargingStationsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getChargingStations: builder.query<ChargingStationMapItem[], void>({
      query: () => ({
        url: HASURA_GRAPHQL_URL,
        method: "POST",
        body: {
          query: CHARGING_STATIONS_QUERY,
          variables: {
            limit: 100,
            offset: 0,
            order_by: { updatedAt: "desc" },
            where: { _and: [] },
          },
          operationName: "ChargingStationsList",
        },
      }),
      transformResponse: (response: ChargingStationsResponse) =>
        response.data.ChargingStations.map(mapStation),
    }),
  }),
  overrideExisting: false,
});

export const { useGetChargingStationsQuery } = chargingStationsApi;
