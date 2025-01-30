import Navbar from "./Navbar";

const Layout = ({ children , authUser}) => {
	if(!authUser) {
		return (
		<div className='min-h-screen '>
			<main className='max-w-7xl mx-auto px-4 py-6'>{children}</main>
		</div>);
	}

	return (
		<div className='min-h-screen   rounded-lg' >
			<Navbar />
			<main className='max-w-7xl mx-auto px-4 py-6'>{children}</main>
		</div>
	);
};
export default Layout;
