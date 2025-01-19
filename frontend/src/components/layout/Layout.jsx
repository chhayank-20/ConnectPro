import Navbar from "./Navbar";

const Layout = ({ children , authUser}) => {

	if(!authUser) {
		return (
		<div className='min-h-screen bg-base-100 bg-gradient-to-r from-blue-300 to-purple-300 rounded-lg' style={{ background: 'linear-gradient(to right,rgb(159, 157, 248),rgb(236, 206, 255))' }}>
			<main className='max-w-7xl mx-auto px-4 py-6'>{children}</main>
		</div>);
	}

	return (

		<div className='min-h-screen bg-base-100 bg-gradient-to-r from-blue-300 to-purple-300  rounded-lg' >
			<Navbar />
			<main className='max-w-7xl mx-auto px-4 py-6'>{children}</main>
		</div>
	);
};
export default Layout;
