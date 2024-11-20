import TopNavigationBar from './TopNavigationBar';
import { Check } from 'lucide-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleCheck } from '@fortawesome/free-solid-svg-icons';
import React, { useState, useCallback } from 'react';

const Subscription = () => {
    const subscriptionBenefitItem = {icon: faCircleCheck, label: Check};
    const [isSubscriptionModalOpen, setIsSubscriptionModalOpen] = useState(false);
    const [selectedSubscription, setSelectedSubscription] = useState(false);
    const [inputVal, setInputVal] = useState('');
    
    const openModal = (subscription) => {
        setSelectedSubscription(subscription);
        setIsSubscriptionModalOpen(true);
    };

    const closeModal = () => {
        setSelectedSubscription(false);
        setIsSubscriptionModalOpen(null);
        setInputVal('');
    };

    const handleSubscribe = () => {
        //send mail to director using chargebee :)
        closeModal();
    };

    return (
        <div>
            <div className="relative z-50">
                <TopNavigationBar/>
            </div>

            {/*Modal window*/}
            {isSubscriptionModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center backdrop-blur-xl" style={{ zIndex: 100 }}>
                    <div
                        className="flex flex-col items-center justify-center m-16 max-w-sm p-6 rounded-lg drop-shadow-lg sm:p-8"
                        style={{ backgroundColor: '#be123c' }}
                    >
                        
                        <h5 className="mb-4 text-2xl font-bold text-center" style={{ color: '#ffe4e6' }}>
                            Bevestig je aankoop!
                        </h5>
                        

                        <div className="flex flex-col items-center text-center space-y-4" style={{ color: '#ffe4e6' }}>
                        <div className="flex items-baseline space-x-1">
                            <span className="text-3xl font-semibold">€</span>
                            <span className="text-3xl font-extrabold tracking-tight">{selectedSubscription === 'basis' ? '10' : selectedSubscription === 'gevorderd' ? '17' : '20'}</span>
                            <span className="text-xl font-normal" style={{ color: '#fecdd3' }}>/maand</span>
                        </div>

                        <p className="text-sm">
                            Ben je zeker dat je wilt veranderen naar het <span className="font-bold">{selectedSubscription}</span>{' '}
                            abonnement? Zo ja, type: <span className="font-bold">BEVESTIG</span>
                        </p>

                        <input
                            type="text"
                            placeholder="BEVESTIG"
                            value={inputVal}
                            onChange={e => setInputVal(e.target.value)}
                            className="w-full p-2 border-2 rounded-lg border-rose-300 text-rose-700 focus:ring-rose-500 focus:border-rose-500 outline-none"
                            style={{ backgroundColor: '#ffe4e6' }}
                        />
                        </div>
                        <form onSubmit={handleSubscribe} className='flex items-start justify-between w-full space-x-4'>
                            <button 
                                onClick={closeModal}
                                type="button"
                                className="mt-6 font-medium rounded-lg text-sm px-5 py-2.5 inline-flex justify-center w-full text-center transition duration-300"
                                style={{ color: '#881337', backgroundColor: '#fda4af' }}
                                onMouseOver={(e) => (e.target.style.backgroundColor = '#fb7185')}
                                onMouseOut={(e) => (e.target.style.backgroundColor = '#fda4af')}
                            >
                                Terug
                            </button>

                            <button
                                type="submit"
                                disabled={inputVal!=='BEVESTIG'}
                                className="mt-6 font-medium rounded-lg text-sm px-5 py-2.5 inline-flex justify-center w-full text-center transition duration-300"
                                style={{ color: '#881337', backgroundColor: '#fff1f2' }}
                                onMouseOver={(e) => (e.target.style.backgroundColor = '#fecdd3')}
                                onMouseOut={(e) => (e.target.style.backgroundColor = '#fff1f2')}
                            >
                                Abonneer
                            </button>
                        </form>
                    </div>
                </div>
            )}


            
            {/* Subscription card component used from flowbite */}
            <div className='flex justify-center items-center h-screen'>
                <div className="m-16 w-full max-w-sm p-4 rounded-lg drop-shadow-lg sm:p-8" style={{ backgroundColor: '#e11d48' }}>
                    <h5 className="mb-4 text-xl font-bold" style={{ color: '#ffe4e6' }}>Basis</h5>

                    <div className="flex items-baseline" style={{ color: '#ffe4e6' }}>
                        <span className="text-3xl font-semibold">€</span>
                        <span className="text-5xl font-extrabold tracking-tight">10</span>
                        <span className="ms-1 text-xl font-normal" style={{ color: '#fecdd3' }}>/maand</span>
                    </div>
                    
                    <ul role="list" className="space-y-5 my-7">
                        <li className="flex items-center">
                            <FontAwesomeIcon 
                            icon = {subscriptionBenefitItem.icon}
                            className="text-white text-base transition duration-300 hover:text-rose-700"
                            />
                            <span className="text-base font-normal leading-tight ms-3" style={{ color: '#ffe4e6' }}>Onbeperkt aantal berichten</span>
                        </li>

                        <li className="flex items-center">
                            <FontAwesomeIcon 
                            icon = {subscriptionBenefitItem.icon}
                            className="text-white text-base transition duration-300 hover:text-rose-700"
                            />
                            <span className="text-base font-normal leading-tight ms-3" style={{ color: '#ffe4e6' }}>Limiet van 10 berichten per dag</span>
                        </li>

                    </ul>

                    <button onClick={() => openModal('basis')} type="button" className="font-medium rounded-lg text-sm px-5 py-2.5 inline-flex justify-center w-full text-center" style={{ color: '#881337', backgroundColor: '#ffe4e6', hover: { backgroundColor: '#fecdd3' } }}>Choose plan</button>
                </div>

                <div className="m-16 w-full max-w-sm p-4 rounded-lg drop-shadow-lg sm:p-8" style={{ backgroundColor: '#be123c' }}>
                    <h5 className="mb-4 text-xl font-bold" style={{ color: '#ffe4e6' }}>Gevorderd</h5>

                    <div className="flex items-baseline" style={{ color: '#ffe4e6' }}>
                        <span className="text-3xl font-semibold">€</span>
                        <span className="text-5xl font-extrabold tracking-tight">17</span>
                        <span className="ms-1 text-xl font-normal" style={{ color: '#fecdd3' }}>/maand</span>
                    </div>
                    
                    <ul role="list" className="space-y-5 my-7">
                        <li className="flex items-center">
                        <FontAwesomeIcon 
                            icon = {subscriptionBenefitItem.icon}
                            className="text-white text-base transition duration-300 hover:text-rose-700"
                            />
                            <span className="text-base font-normal leading-tight ms-3" style={{ color: '#ffe4e6' }}>Alles van het basisabonnement</span>
                        </li>

                        <li className="flex items-center">
                        <FontAwesomeIcon 
                            icon = {subscriptionBenefitItem.icon}
                            className="text-white text-base transition duration-300 hover:text-rose-700"
                            />
                            <span className="text-base font-normal leading-tight ms-3" style={{ color: '#ffe4e6' }}>Zie wie je likes heeft gegeven</span>
                        </li>

                        <li className="flex items-center">
                        <FontAwesomeIcon 
                            icon = {subscriptionBenefitItem.icon}
                            className="text-white text-base transition duration-300 hover:text-rose-700"
                            />
                            <span className="text-base font-normal leading-tight ms-3" style={{ color: '#ffe4e6' }}>Limiet van 20 keer spinnen per dag</span>
                        </li>

                    </ul>

                    <button onClick={() => openModal('gevorderd')} type="button" className="font-medium rounded-lg text-sm px-5 py-2.5 inline-flex justify-center w-full text-center" style={{ color: '#881337', backgroundColor: '#ffe4e6', hover: { backgroundColor: '#fecdd3' } }}>Choose plan</button>
                </div>

                <div className="m-16 w-full max-w-sm p-4 rounded-lg drop-shadow-lg sm:p-8" style={{ backgroundColor: '#9f1239' }}>
                    <h5 className="mb-4 text-xl font-bold" style={{ color: '#ffe4e6' }}>Elite</h5>

                    <div className="flex items-baseline" style={{ color: '#ffe4e6' }}>
                        <span className="text-3xl font-semibold">€</span>
                        <span className="text-5xl font-extrabold tracking-tight">20</span>
                        <span className="ms-1 text-xl font-normal" style={{ color: '#fecdd3' }}>/maand</span>
                    </div>
                    
                    <ul role="list" className="space-y-5 my-7">
                        <li className="flex items-center">
                        <FontAwesomeIcon 
                            icon = {subscriptionBenefitItem.icon}
                            className="text-white text-base transition duration-300"
                            />
                            <span className="text-base font-normal leading-tight ms-3" style={{ color: '#ffe4e6' }}>Alles van het gevorderde abonnement</span>
                        </li>

                        <li className="flex items-center">
                        <FontAwesomeIcon 
                            icon = {subscriptionBenefitItem.icon}
                            className="text-white text-base transition duration-300"
                            />
                            <span className="text-base font-normal leading-tight ms-3" style={{ color: '#ffe4e6' }}>Onbeperkte hoeveelheid spinnen per dag</span>
                        </li>

                        <li className="flex items-center">
                        <FontAwesomeIcon 
                            icon = {subscriptionBenefitItem.icon}
                            className="text-white text-base transition duration-300"
                            />
                            <span className="text-base font-normal leading-tight ms-3" style={{ color: '#ffe4e6' }}>Mensen komen je profiel sneller tegen</span>
                        </li>

                        <li className="flex items-center">
                        <FontAwesomeIcon 
                            icon = {subscriptionBenefitItem.icon}
                            className="text-white text-base transition duration-300 hover:text-rose-700"
                            />
                            <span className="text-base font-normal leading-tight ms-3" style={{ color: '#ffe4e6' }}>Eén bericht naar een niet-match</span>
                        </li>
                    </ul>

                    <button onClick={() => openModal('elite')} type="button" className="font-medium rounded-lg text-sm px-5 py-2.5 inline-flex justify-center w-full text-center" style={{ color: '#881337', backgroundColor: '#ffe4e6', hover: { backgroundColor: '#fecdd3' } }}>Choose plan</button>
                </div>
            
        
            </div>  
        </div>        
    );

};

export default Subscription;