import { useNavigate } from 'react-router-dom';
import TopNavigationBar from './TopNavigationBar';

const subscription = () => {

    

    return (
        <div>
            <TopNavigationBar/>
            
            {/* Subscription card component used from flowbite */}
            <div className='flex justify-center items-center h-screen'>
                <div className="m-16 w-full max-w-sm p-4 rounded-lg drop-shadow-lg sm:p-8" style={{ backgroundColor: '#e11d48' }}> {/* Darker background */}
                    <h5 className="mb-4 text-xl font-bold" style={{ color: '#ffe4e6' }}>Standard Plan</h5> {/* Light text */}

                    <div className="flex items-baseline" style={{ color: '#ffe4e6' }}> {/* Light text */}
                        <span className="text-3xl font-semibold">€</span>
                        <span className="text-5xl font-extrabold tracking-tight">10</span>
                        <span className="ms-1 text-xl font-normal" style={{ color: '#fecdd3' }}>/maand</span> {/* Slightly darker light color */}
                    </div>
                    
                    <ul role="list" className="space-y-5 my-7">
                        <li className="flex items-center">
                            <svg className="flex-shrink-0 w-4 h-4" style={{ color: '#ffe4e6' }} fill="currentColor" viewBox="0 0 20 20"> {/* Light icon */}
                                <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z"/>
                            </svg>
                            <span className="text-base font-normal leading-tight ms-3" style={{ color: '#ffe4e6' }}>5 matches per dag</span> {/* Light text */}
                        </li>

                        <li className="flex line-through decoration-gray-500">
                            <svg className="flex-shrink-0 w-4 h-4" style={{ color: '#4c0519' }} fill="currentColor" viewBox="0 0 20 20"> {/* Dark red icon */}
                                <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z"/>
                            </svg>
                            <span className="text-base font-normal leading-tight ms-3" style={{ color: '#4c0519' }}>Abonnement gratis stopzetten*</span> {/* Dark red text */}
                        </li>
                    </ul>

                    <button type="button" className="font-medium rounded-lg text-sm px-5 py-2.5 inline-flex justify-center w-full text-center" style={{ color: '#881337', backgroundColor: '#ffe4e6', hover: { backgroundColor: '#fecdd3' } }}>Choose plan</button> {/* Light button with dark text */}
                </div>

                <div className="m-16 w-full max-w-sm p-4 rounded-lg drop-shadow-lg sm:p-8" style={{ backgroundColor: '#be123c' }}> {/* Darker background */}
                    <h5 className="mb-4 text-xl font-bold" style={{ color: '#ffe4e6' }}>Lover Plan</h5> {/* Light text */}

                    <div className="flex items-baseline" style={{ color: '#ffe4e6' }}> {/* Light text */}
                        <span className="text-3xl font-semibold">€</span>
                        <span className="text-5xl font-extrabold tracking-tight">17</span>
                        <span className="ms-1 text-xl font-normal" style={{ color: '#fecdd3' }}>/maand</span> {/* Slightly darker light color */}
                    </div>
                    
                    <ul role="list" className="space-y-5 my-7">
                        <li className="flex items-center">
                            <svg className="flex-shrink-0 w-4 h-4" style={{ color: '#ffe4e6' }} fill="currentColor" viewBox="0 0 20 20"> {/* Light icon */}
                                <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z"/>
                            </svg>
                            <span className="text-base font-normal leading-tight ms-3" style={{ color: '#ffe4e6' }}>10 matches per dag</span> {/* Light text */}
                        </li>

                        <li className="flex line-through decoration-gray-500">
                            <svg className="flex-shrink-0 w-4 h-4" style={{ color: '#4c0519' }} fill="currentColor" viewBox="0 0 20 20"> {/* Dark red icon */}
                                <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z"/>
                            </svg>
                            <span className="text-base font-normal leading-tight ms-3" style={{ color: '#4c0519' }}>Abonnement gratis stopzetten*</span> {/* Dark red text */}
                        </li>
                    </ul>

                    <button type="button" className="font-medium rounded-lg text-sm px-5 py-2.5 inline-flex justify-center w-full text-center" style={{ color: '#881337', backgroundColor: '#ffe4e6', hover: { backgroundColor: '#fecdd3' } }}>Choose plan</button> {/* Light button with dark text */}
                </div>

                <div className="m-16 w-full max-w-sm p-4 rounded-lg drop-shadow-lg sm:p-8" style={{ backgroundColor: '#9f1239' }}> {/* Darker background */}
                    <h5 className="mb-4 text-xl font-bold" style={{ color: '#ffe4e6' }}>Rizzler Plan</h5> {/* Light text */}

                    <div className="flex items-baseline" style={{ color: '#ffe4e6' }}> {/* Light text */}
                        <span className="text-3xl font-semibold">€</span>
                        <span className="text-5xl font-extrabold tracking-tight">20</span>
                        <span className="ms-1 text-xl font-normal" style={{ color: '#fecdd3' }}>/maand</span> {/* Slightly darker light color */}
                    </div>
                    
                    <ul role="list" className="space-y-5 my-7">
                        <li className="flex items-center">
                            <svg className="flex-shrink-0 w-4 h-4" style={{ color: '#ffe4e6' }} fill="currentColor" viewBox="0 0 20 20"> {/* Light icon */}
                                <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z"/>
                            </svg>
                            <span className="text-base font-normal leading-tight ms-3" style={{ color: '#ffe4e6' }}>Oneindig matches per dag</span> {/* Light text */}
                        </li>

                        <li className="flex items-center">
                            <svg className="flex-shrink-0 w-4 h-4" style={{ color: '#ffe4e6' }} fill="currentColor" viewBox="0 0 20 20"> {/* Light icon */}
                                <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z"/>
                            </svg>
                            <span className="text-base font-normal leading-tight ms-3" style={{ color: '#ffe4e6' }}>Rizzler university abonnement</span> {/* Light text */}
                        </li>

                        <li className="flex items-center">
                            <svg className="flex-shrink-0 w-4 h-4" style={{ color: '#ffe4e6' }} fill="currentColor" viewBox="0 0 20 20"> {/* Light icon */}
                                <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z"/>
                            </svg>
                            <span className="text-base font-normal leading-tight ms-3" style={{ color: '#ffe4e6' }}>Abonnement gratis stopzetten*</span> {/* Light text */}
                        </li>
                    </ul>

                    <button type="button" className="font-medium rounded-lg text-sm px-5 py-2.5 inline-flex justify-center w-full text-center" style={{ color: '#881337', backgroundColor: '#ffe4e6', hover: { backgroundColor: '#fecdd3' } }}>Choose plan</button> {/* Light button with dark text */}
                </div>
            
        
            </div>  
        </div>        
    );

};

export default subscription;