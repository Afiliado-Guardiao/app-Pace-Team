export interface IQueryConfig {
	staleTime: number;
	cacheTime: number;
	retry: number | boolean;
	refetchOnWindowFocus: boolean;
	refetchOnReconnect: boolean;
}
