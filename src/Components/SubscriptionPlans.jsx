import TopNavigationBar from './TopNavigationBar';
import { Check } from 'lucide-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleCheck } from '@fortawesome/free-solid-svg-icons';
import React, { useState, useEffect} from 'react';
import { ToggleSlider }  from "react-toggle-slider";
import { supabase } from '../lib/helper/supabaseClient'; 

const Subscription = () => {
    const subscriptionBenefitItem = {icon: faCircleCheck, label: Check};
    const [isSubscriptionModalOpen, setIsSubscriptionModalOpen] = useState(false);
    const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
    const [selectedSubscription, setSelectedSubscription] = useState(false);
    const [inputVal, setInputVal] = useState('');
    const [payAnnually, setPayAnnually] = useState(false);
    const [userId, setUserId] = useState(null);


    const monthlyPrices = {basis: 10, gevorderd: 17, elite: 20}
    const annualPrices = {basis: 110, gevorderd: 187, elite: 220}
    const annualPricesSaved = {basis: 120, gevorderd: 204, elite: 240}

    useEffect(() => {
        const fetchUserData = async () => {
          const { data: { session } } = await supabase.auth.getSession();
          if (session) {
            setUserId(session.user.id);
            console.log("Session user ID:", session.user.id);
          }
        };
        fetchUserData();
      }, []);

    const openSubscriptionModal = (subscription) => {
        setSelectedSubscription(subscription);
        setIsSubscriptionModalOpen(true);
    };

    const closeSubscriptionModal = () => {
        setSelectedSubscription(false);
        setIsSubscriptionModalOpen(false);
        setInputVal('');
    };

    const openFeedbackModal = () => {
        setIsFeedbackModalOpen(true);
    };

    const closeFeedbackModal = () => {
        setIsFeedbackModalOpen(false);
    };

    const handleSubscribe = async (e) => {
        console.log("subscriptionhandler entered");
        e.preventDefault();
  
        if (inputVal !== 'BEVESTIG') return;
        //send mail to director using chargebee :)
        const { data: { session } } = await supabase.auth.getSession();
        const endDate = new Date();
        if (payAnnually){
            endDate.setFullYear(endDate.getFullYear()+1);
        }
        else {
            endDate.setMonth(endDate.getMonth()+1);
        }
    

        const subscriptonFields = {
                    user_id: userId,
                    subscription: selectedSubscription,
                    end_date: endDate,
                    annual_payment: payAnnually,
                    active:true
                }
        const {data: existingSubscription, error: fetchFailed} = await supabase
            .from('subscriptions')
            .select('*')
            .eq('user_id', userId)
            .single();

        if (fetchFailed) {
            console.log("no existing subscription", fetchFailed) 
            //return;
        }
        
        if (existingSubscription) {
            const { error } = await supabase
                .from('subscriptions')
                .update(subscriptonFields)
                .eq('user_id', userId);
            if (error) {
                console.log("update failed", error);
                return;
            }
            console.log("subscription updated");

        }
        else {
            const { error } = await supabase
                .from('subscriptions')
                .insert([subscriptonFields])
            if (error){
                console.log("inserting subscription failed", error);
            }
            console.log("subscription inserted");
        }
        
        openFeedbackModal();
        closeSubscriptionModal();

    };

    return (
        <div>
            <div className="relative z-50">
                <TopNavigationBar/>
            </div>

            {/*Subscription Modal window*/}
            {isSubscriptionModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center backdrop-blur-xl" style={{ zIndex: 100 }}>
                    <div
                        className="flex flex-col items-center justify-center m-16 max-w-sm p-6 rounded-lg drop-shadow-lg sm:p-8"
                        style={{ backgroundColor: '#be123c' }}
                    >
                        <form onSubmit={handleSubscribe}>
                        
                        <h5 className="mb-4 text-2xl font-bold text-center" style={{ color: '#ffe4e6' }}>
                            Bevestig je aankoop!
                        </h5>
                        

                        <div className="flex flex-col items-center text-center space-y-4" style={{ color: '#ffe4e6' }}>
                            <div className="flex items-baseline space-x-1">
                                <span className="text-3xl font-semibold">€</span>
                                <span className="text-3xl font-extrabold tracking-tight">{payAnnually ? annualPrices[selectedSubscription] : monthlyPrices[selectedSubscription]}</span>
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
                        <div  className='flex items-start justify-between w-full space-x-4'>
                            <button 
                                onClick={closeSubscriptionModal}
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
                            
                        </div>
                        </form>
                    </div>
                </div>
            )}

            {/*Confirmation Modal window*/}
            {isFeedbackModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center backdrop-blur-xl" style={{ zIndex: 100 }}>
                    <div
                        className="flex flex-col items-center justify-center m-16 max-w-sm p-6 rounded-lg drop-shadow-lg sm:p-8"
                        style={{ backgroundColor: '#be123c' }}
                    >
                        <h5 className="mb-4 text-2xl font-bold text-center" style={{ color: '#ffe4e6' }}>
                            Bedankt voor je aankoop!
                        </h5>
                        <span style={{ color: '#ffe4e6' }}>De betaling zal doorgevoerd worden via je faciliteit. Geniet van je nieuwe abonnement!</span>
                        <button 
                            onClick={closeFeedbackModal}
                            type="button"
                            className="mt-6 font-medium rounded-lg text-sm px-5 py-2.5 inline-flex justify-center w-full text-center transition duration-300"
                            style={{ color: '#881337', backgroundColor: '#fff1f2' }}
                            onMouseOver={(e) => (e.target.style.backgroundColor = '#fecdd3')}
                            onMouseOut={(e) => (e.target.style.backgroundColor = '#fff1f2')}
                        >
                            Sluiten
                        </button>
                    </div>
                </div>
            )}

            {/* Subscription card component used from flowbite */}
            <div className='flex flex-col items-center justify-center min-h-screen'>
                
                <div className='flex justify-center items-center'>
                    <div className="m-16 w-full max-w-sm p-4 rounded-lg drop-shadow-lg sm:p-8" style={{ backgroundColor: '#e11d48' }}>
                        <h5 className="mb-4 text-xl font-bold" style={{ color: '#ffe4e6' }}>Basis</h5>

                        <div className="flex items-baseline" style={{ color: '#ffe4e6' }}>
                            <span className="text-3xl font-semibold">€</span>
                            <span className="text-3xl tracking-tight line-through">{payAnnually ? annualPricesSaved.basis : ''}</span>
                            <span className="text-5xl font-extrabold tracking-tight">{payAnnually ? annualPrices.basis : monthlyPrices.basis}</span>
                            <span className="ms-1 text-xl font-normal" style={{ color: '#fecdd3' }}>{payAnnually ? "/jaar" : "/maand"}</span>
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

                        <button onClick={() => openSubscriptionModal('basis')} type="button" className="font-medium rounded-lg text-sm px-5 py-2.5 inline-flex justify-center w-full text-center" style={{ color: '#881337', backgroundColor: '#ffe4e6', hover: { backgroundColor: '#fecdd3' } }}>Choose plan</button>
                    </div>

                    <div className="m-16 w-full max-w-sm p-4 rounded-lg drop-shadow-lg sm:p-8" style={{ backgroundColor: '#be123c' }}>
                        <h5 className="mb-4 text-xl font-bold" style={{ color: '#ffe4e6' }}>Gevorderd</h5>

                        <div className="flex items-baseline" style={{ color: '#ffe4e6' }}>
                            <span className="text-3xl font-semibold">€</span>
                            <span className="text-3xl tracking-tight line-through">{payAnnually ? annualPricesSaved.gevorderd : ''}</span>
                            <span className="text-5xl font-extrabold tracking-tight">{payAnnually ? annualPrices.gevorderd : monthlyPrices.gevorderd}</span>
                            <span className="ms-1 text-xl font-normal" style={{ color: '#fecdd3' }}>{payAnnually ? "/jaar" : "/maand"}</span>
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

                        <button onClick={() => openSubscriptionModal('gevorderd')} type="button" className="font-medium rounded-lg text-sm px-5 py-2.5 inline-flex justify-center w-full text-center" style={{ color: '#881337', backgroundColor: '#ffe4e6', hover: { backgroundColor: '#fecdd3' } }}>Choose plan</button>
                    </div>

                    <div className="m-16 w-full max-w-sm p-4 rounded-lg drop-shadow-lg sm:p-8" style={{ backgroundColor: '#9f1239' }}>
                        <h5 className="mb-4 text-xl font-bold" style={{ color: '#ffe4e6' }}>Elite</h5>

                        <div className="flex items-baseline" style={{ color: '#ffe4e6' }}>
                            <span className="text-3xl font-semibold">€</span>
                            <span className="text-3xl tracking-tight line-through">{payAnnually ? annualPricesSaved.elite : ''}</span>
                            <span className="text-5xl font-extrabold tracking-tight">{payAnnually ? annualPrices.elite : monthlyPrices.elite}</span>
                            <span className="ms-1 text-xl font-normal" style={{ color: '#fecdd3' }}>{payAnnually ? "/jaar" : "/maand"}</span>
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

                        <button onClick={() => openSubscriptionModal('elite')} type="button" className="font-medium rounded-lg text-sm px-5 py-2.5 inline-flex justify-center w-full text-center" style={{ color: '#881337', backgroundColor: '#ffe4e6', hover: { backgroundColor: '#fecdd3' } }}>Choose plan</button>
                    </div>
                </div>
                <div className='flex flex-row items-center mb-8 justify-center rounded-lg' style={{background: '#e11d48', color: '#fafaf9'}}>
                    <span className='p-4'>Betaal maandelijks</span>
                    <ToggleSlider
                    onToggle={state => setPayAnnually(state)}
                    barBackgroundColor='#fda4af'
                    barBackgroundColorActive='#881337'

                    />
                    <span className='p-4'>Betaal jaarlijks</span>
                </div>
        
            </div>  
        </div>        
    );

};

export default Subscription;