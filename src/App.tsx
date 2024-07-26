import dpsLogo from './assets/DPS.svg';
import './App.css';
import { CRM } from './components/CRM';

function App() {
	return (
		<>
			<div>
				<a href="https://www.digitalproductschool.io/" target="_blank">
					<img src={dpsLogo} className="logo" alt="DPS logo" />
				</a>
			</div>
			<div className="home-card">
				{/* <p>Your solution goes here 😊</p> */}
				<h1><CRM /></h1>
			</div>
		</>
	);
}

export default App;
