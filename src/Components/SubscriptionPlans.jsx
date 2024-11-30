
import { Check } from 'lucide-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleCheck } from '@fortawesome/free-solid-svg-icons';
import React, { useState, useEffect} from 'react';
import { ToggleSlider }  from "react-toggle-slider";
import { supabase } from '../lib/helper/supabaseClient'; 
import { useAnalytics } from '../hooks/analyticsContext';

const Subscription = () => {
    const subscriptionBenefitItem = {icon: faCircleCheck, label: Check};
    const [isSubscriptionModalOpen, setIsSubscriptionModalOpen] = useState(false);
    const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
    const [selectedSubscription, setSelectedSubscription] = useState(false);
    const [inputVal, setInputVal] = useState('');
    const [currentSubscription, setCurrentSubscription] = useState('BASIS');
    const [payAnnually, setPayAnnually] = useState(false);
    const [userId, setUserId] = useState(null);

    const { track } = useAnalytics();

    const monthlyPrices = {BASIS: 10, GEVORDERD: 17, ELITE: 20}
    const annualPrices = {BASIS: 110, GEVORDERD: 187, ELITE: 220}
    const annualPricesSaved = {BASIS: 120, GEVORDERD: 204, ELITE: 240}

    useEffect(() => {
        const fetchUserData = async () => {
          const { data: { session } } = await supabase.auth.getSession();
          if (session) {
            setUserId(session.user.id);
            console.log("Session user ID:", session.user.id);
            const {data: subscription, error} = await supabase
                .from('subscriptions')
                .select('subscription')
                .eq('user_id', session.user.id)
            if (error) {
                console.log("error fetching subscription", error);
                return;
            }
            else {
                setCurrentSubscription(subscription[0].subscription);
            }
          }
        };
        fetchUserData();
      }, []);

    const openSubscriptionModal = (subscription) => {
        setSelectedSubscription(subscription);
        setIsSubscriptionModalOpen(true);
        track('Subscription Checkout', {
            user: userId,
            subscription: selectedSubscription
        });
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
        track('Subscription Confirmed', {
            user: userId,
            subscription: selectedSubscription
        });
        openFeedbackModal();
        setCurrentSubscription(selectedSubscription);
        closeSubscriptionModal();

    };

    return (
        <div>
           

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
                                Ben je zeker dat je wilt veranderen naar het <span className="font-bold">{currentSubscription}</span>{' '}
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
                <div
                    className={
                        "m-16 w-full max-w-sm p-4 rounded-lg drop-shadow-lg sm:p-8 bg-amber-600 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.5)_50%,transparent_75%,transparent_100%)] bg-[length:250%_250%,100%_100%] bg-no-repeat px-8 py-16 shadow-2xl transition-[background-position_0s_ease] hover:bg-[position:200%_0,0_0] hover:duration-[1500ms]" +
                        (currentSubscription === "BASIS" ? " border-4 border-neutral-50 ring-4 ring-amber-600" : "")
                    }
                    
                    >           
                        <h5 className="mb-4 text-xl font-bold text-neutral-50">Basis</h5>
                        <div className="flex items-baseline text-neutral-50">
                            <span className="text-3xl font-semibold">€</span>
                            <span className="text-3xl tracking-tight line-through">{payAnnually ? annualPricesSaved.BASIS : ''}</span>
                            <span className="text-5xl font-extrabold tracking-tight">{payAnnually ? annualPrices.BASIS : monthlyPrices.BASIS}</span>
                            <span className="ms-1 text-xl font-normal text-neutral-50">{payAnnually ? "/jaar" : "/maand"}</span>
                        </div>
                        
                        <ul role="list" className="space-y-5 my-7">
                            <li className="flex items-center">
                                <FontAwesomeIcon 
                                icon = {subscriptionBenefitItem.icon}
                                className="text-white text-base transition duration-300 hover:text-rose-700"
                                />
                                <span className="text-base font-normal leading-tight ms-3 text-neutral-50">Onbeperkt aantal berichten</span>
                            </li>

                            <li className="flex items-center">
                                <FontAwesomeIcon 
                                icon = {subscriptionBenefitItem.icon}
                                className="text-white text-base transition duration-300 hover:text-rose-700"
                                />
                                <span className="text-base font-normal leading-tight ms-3 text-neutral-50">Limiet van 10 berichten per dag</span>
                            </li>

                        </ul>

                        <button 
                        onClick={() => openSubscriptionModal('BASIS')} 
                        disabled={currentSubscription === 'BASIS'}
                        type="button" className="font-medium rounded-lg text-sm px-5 py-2.5 inline-flex justify-center w-full text-center" 
                        style={{ color: '#881337', 
                            backgroundColor: '#ffe4e6', 
                            hover: { backgroundColor: '#fecdd3' },
                            cursor:  currentSubscription === 'BASIS' ? 'not-allowed' : 'pointer'
                            }}>{currentSubscription === 'BASIS' ? 'Huidig plan' : 'Kies plan'}</button>
                    </div>

                    <div
                    className={
                        "m-16 w-full max-w-sm p-4 rounded-lg drop-shadow-lg sm:p-8 bg-gray-400 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.5)_50%,transparent_75%,transparent_100%)] bg-[length:250%_250%,100%_100%] bg-no-repeat px-8 py-16 shadow-2xl transition-[background-position_0s_ease] hover:bg-[position:200%_0,0_0] hover:duration-[1500ms]" +
                        (currentSubscription === "GEVORDERD" ? " border-4 border-neutral-50 ring-4 ring-gray-400" : "")
                    }
                    
                    >                        
                        <h5 className="mb-4 text-xl font-bold text-neutral-50">Gevorderd</h5>
                        <div className="flex items-baseline text-neutral-50">
                            <span className="text-3xl font-semibold text-neutral-50">€</span>
                            <span className="text-3xl tracking-tight line-through text-neutral-50">{payAnnually ? annualPricesSaved.GEVORDERD : ''}</span>
                            <span className="text-5xl font-extrabold tracking-tight">{payAnnually ? annualPrices.GEVORDERD : monthlyPrices.GEVORDERD}</span>
                            <span className="ms-1 text-xl font-normal text-neutral-50">{payAnnually ? "/jaar" : "/maand"}</span>
                        </div>
                        
                        <ul role="list" className="space-y-5 my-7">
                            <li className="flex items-center">
                            <FontAwesomeIcon 
                                icon = {subscriptionBenefitItem.icon}
                                className="text-white text-base transition duration-300 hover:text-rose-700"
                                />
                                <span className="text-base font-normal leading-tight ms-3 text-neutral-50">Alles van het basisabonnement</span>
                            </li>

                            <li className="flex items-center">
                            <FontAwesomeIcon 
                                icon = {subscriptionBenefitItem.icon}
                                className="text-white text-base transition duration-300 hover:text-rose-700"
                                />
                                <span className="text-base font-normal leading-tight ms-3 text-neutral-50" >Zie wie je likes heeft gegeven</span>
                            </li>

                            <li className="flex items-center">
                            <FontAwesomeIcon 
                                icon = {subscriptionBenefitItem.icon}
                                className="text-white text-base transition duration-300 hover:text-rose-700"
                                />
                                <span className="text-base font-normal leading-tight ms-3 text-neutral-50" >Limiet van 20 keer spinnen per dag</span>
                            </li>

                        </ul>

                        <button 
                        onClick={() => openSubscriptionModal('GEVORDERD')} 
                        disabled={currentSubscription === 'GEVORDERD'}
                        type="button" className="font-medium rounded-lg text-sm px-5 py-2.5 inline-flex justify-center w-full text-center" 
                        style={{ color: '#881337', 
                        backgroundColor: '#fafafa', 
                        hover: { backgroundColor: '#fecdd3' },
                        cursor:  currentSubscription === 'GEVORDERD' ? 'not-allowed' : 'pointer'
                        }}>{currentSubscription === 'GEVORDERD' ? 'Huidig plan' : 'Kies plan'}</button>
                    </div>

                    <div
                        className={
                        "m-16 w-full max-w-sm p-4 rounded-lg drop-shadow-lg sm:p-8 bg-amber-400 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.5)_50%,transparent_75%,transparent_100%)] bg-[length:250%_250%,100%_100%] bg-no-repeat px-8 py-16 shadow-2xl transition-[background-position_0s_ease] hover:bg-[position:200%_0,0_0] hover:duration-[1500ms]" +
                            (currentSubscription === "ELITE" ? " border-4 border-neutral-50 ring-4 ring-amber-400" : "")}
                        
                    >           
                        <h5 className="mb-4 text-xl font-bold" style={{ color: '#fafafa' }}>Elite</h5>
                        <div className="flex items-baseline" style={{ color: '#fafafa' }}>
                            <span className="text-3xl font-semibold">€</span>
                            <span className="text-3xl tracking-tight line-through">{payAnnually ? annualPricesSaved.ELITE : ''}</span>
                            <span className="text-5xl font-extrabold tracking-tight">{payAnnually ? annualPrices.ELITE : monthlyPrices.ELITE}</span>
                            <span className="ms-1 text-xl font-normal" style={{ color: '#fafafa' }}>{payAnnually ? "/jaar" : "/maand"}</span>
                        </div>
                        
                        <ul role="list" className="space-y-5 my-7">
                            <li className="flex items-center">
                            <FontAwesomeIcon 
                                icon = {subscriptionBenefitItem.icon}
                                className="text-white text-base transition duration-300"
                                />
                                <span className="text-base font-normal leading-tight ms-3" style={{ color: '#fafafa' }}>Alles van het gevorderde abonnement</span>
                            </li>

                            <li className="flex items-center">
                            <FontAwesomeIcon 
                                icon = {subscriptionBenefitItem.icon}
                                className="text-white text-base transition duration-300"
                                />
                                <span className="text-base font-normal leading-tight ms-3" style={{ color: '#fafafa' }}>Onbeperkte hoeveelheid spinnen per dag</span>
                            </li>

                            <li className="flex items-center">
                            <FontAwesomeIcon 
                                icon = {subscriptionBenefitItem.icon}
                                className="text-white text-base transition duration-300"
                                />
                                <span className="text-base font-normal leading-tight ms-3" style={{ color: '#fafafa' }}>Mensen komen je profiel sneller tegen</span>
                            </li>

                            <li className="flex items-center">
                            <FontAwesomeIcon 
                                icon = {subscriptionBenefitItem.icon}
                                className="text-white text-base transition duration-300 hover:text-rose-700"
                                />
                                <span className="text-base font-normal leading-tight ms-3" style={{ color: '#fafafa' }}>Eén bericht naar een niet-match</span>
                            </li>
                        </ul>

                        <button 
                        onClick={() => openSubscriptionModal('ELITE')} 
                        disabled={currentSubscription === 'ELITE'}
                        type="button" className="font-medium rounded-lg text-sm px-5 py-2.5 inline-flex justify-center w-full text-center" 
                        style={{ color: '#881337', 
                            backgroundColor: '#fafafa', 
                            hover: { backgroundColor: '#fecdd3' },
                            cursor:  currentSubscription === 'ELITE' ? 'not-allowed' : 'pointer'
                            }}>{currentSubscription === 'ELITE' ? 'Huidig plan' : 'Kies plan'}</button>
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