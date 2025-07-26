import Banner from '../components/Banner';
import Highlights from '../components/Highlights';

export default function Home(){
	const data = {
	       title: "Capstone 3: E Commerce App",
	       content: "Opportunities for everyone, everywhere",
	       destination: "/products",
	       buttonLabel: "Enroll now!"
	   }
	
	return (
		<>
			<Banner data = {data}/>
			<Highlights/>
		</>
		)
}