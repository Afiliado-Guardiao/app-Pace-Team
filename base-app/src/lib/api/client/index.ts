import axios from "axios";

import { API_URL, TIMEOUT } from "../../constants";

export const apiClient = axios.create({
	baseURL: API_URL,
	timeout: TIMEOUT,
	headers: {
		"Content-Type": "application/json",
	},
});
