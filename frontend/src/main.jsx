import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import 'bootstrap/dist/css/bootstrap.min.css'; 
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { BrowserRouter } from "react-router-dom";
import {Provider} from 'react-redux';
import store from './lib/redux/store';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import { GoogleOAuthProvider } from "@react-oauth/google"
const queryClient = new QueryClient();

createRoot(document.getElementById("root")).render(
	// <StrictMode>
	
		<BrowserRouter>
			<Provider store={store}>
				<QueryClientProvider client={queryClient}>
					<App />
					{/* <GoogleOAuthProvider clientId='58085916835-rj97dpslo3pf546robcltoi5o3me5ab8.apps.googleusercontent.com'>
						<App />
					</GoogleOAuthProvider> */}
					
				</QueryClientProvider>
			</Provider>
		</BrowserRouter>

	// </StrictMode>
);
