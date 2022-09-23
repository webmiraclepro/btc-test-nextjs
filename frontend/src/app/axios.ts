import axios from 'axios';
import { API_ENDPOINT } from 'app/helpers/constants';

export default axios.create({ baseURL: API_ENDPOINT });
