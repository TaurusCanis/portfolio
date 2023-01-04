import homeImage from "../img/homeImage.svg";
import moneyTransfer from "../img/moneyTransfer.svg";
import calendar from "../img/calendar.svg";
import student from "../img/student.svg";
import { Link } from "react-router-dom";
import CTA_Button from "../components/CTA_Button";

export default function Home2() {
    return (
        <>
            <section class="ui-section-hero">
                <div class="ui-layout-container">
                <div class="ui-section-hero__layout ui-layout-grid ui-layout-grid-2">
                    {/* <!-- COPYWRITING --> */}
                    <div>
                    <h1>Tutor Tracker</h1>
                    <p class="ui-text-intro">The Business Management Solution for Self-Employed Tutors</p>
                    {/* <!-- CTA --> */}
                    <div class="ui-component-cta ui-layout-flex">
                        {/* <a href="#" role="link" aria-label="#" class="ui-component-button ui-component-button-normal ui-component-button-primary">Get Started for Free</a> */}
                        <CTA_Button text="Get Started for Free" cls="ui-component-button ui-component-button-normal ui-component-button-primary" />
                        <p class="ui-text-note"><small>30 days free trial.</small></p>
                    </div>
                    </div>
                    {/* <!-- IMAGE --> */}
                    {/* <img src="https://res.cloudinary.com/uisual/image/upload/assets/devices/ipad.png" loading="lazy" alt="#" class="ui-image-half-right" /> */}
                    <img src={homeImage} loading="lazy" alt="#" class="ui-image-half-right" />
                </div>
                </div>
            </section>
            {/* <section class="ui-section-customer">
                <div class="ui-layout-container">
                <div class="ui-section-customer__layout ui-layout-flex">
                    <img src="https://res.cloudinary.com/uisual/image/upload/assets/logos/facebook.svg" alt="#" class="ui-section-customer--logo" />
                    <img src="https://res.cloudinary.com/uisual/image/upload/assets/logos/pinterest.svg" alt="#" class="ui-section-customer--logo" />
                    <img src="https://res.cloudinary.com/uisual/image/upload/assets/logos/stripe.svg" alt="#" class="ui-section-customer--logo ui-section-customer--logo-str" />
                    <img src="https://res.cloudinary.com/uisual/image/upload/assets/logos/dribbble.svg" alt="#" class="ui-section-customer--logo" />
                    <img src="https://res.cloudinary.com/uisual/image/upload/assets/logos/behance.svg" alt="#" class="ui-section-customer--logo ui-section-customer--logo-bhn" />
                </div>
                </div>
            </section> */}
            <section class="ui-section-feature">
                <div class="ui-layout-container">
                <div class="ui-section-feature__layout ui-layout-grid ui-layout-grid-3">
                    <div class="ui-component-card ui-component-card--feature">
                    {/* <img src="https://res.cloudinary.com/uisual/image/upload/assets/graphics/notification.png" alt="#" loading="lazy" /> */}
                    <img src={student} alt="#" loading="lazy" />
                    <div class="ui-component-card--feature-content">
                        <h4 class="ui-component-card--feature-title">Track Students</h4>
                        <p>Lorem ipsum dolor sit amet sed eiusmod tempor incididunt.</p>
                    </div>
                    </div>
                    <div class="ui-component-card ui-component-card--feature">
                    {/* <img src="https://res.cloudinary.com/uisual/image/upload/assets/graphics/notification.png" alt="#" loading="lazy" /> */}
                    <img src={calendar} alt="#" loading="lazy" />
                    <div class="ui-component-card--feature-content">
                        <h4 class="ui-component-card--feature-title">Track Appointments</h4>
                        <p>Lorem ipsum dolor sit amet sed eiusmod tempor incididunt.</p>
                    </div>
                    </div>
                    <div class="ui-component-card ui-component-card--feature">
                    {/* <img src="https://res.cloudinary.com/uisual/image/upload/assets/graphics/notification.png" alt="#" loading="lazy" /> */}
                    <img src={moneyTransfer} alt="#" loading="lazy" />
                    <div class="ui-component-card--feature-content">
                        <h4 class="ui-component-card--feature-title">Tracke Revenue</h4>
                        <p>Lorem ipsum dolor sit amet sed eiusmod tempor incididunt.</p>
                    </div>
                    </div>
                </div>
                </div>
            </section>
            {/* <section class="ui-section-testimonial">
                <div class="ui-layout-container">
                <div class="ui-layout-column-4 ui-layout-column-center">
                    <img src="https://res.cloudinary.com/uisual/image/upload/assets/icons/avatar.svg" alt="#" class="ui-section-testimonial--avatar" />
                    <p class="ui-section-testimonial--quote ui-text-intro">&ldquo;Lorem ipsum dolor sit amet, consec adipiscing elit, sed do eiusmod tempor incididunt labore dolore magna.&rdquo;</p>
                    <p class="ui-section-testimonial--author"><strong>Jane Doe</strong><br /><small class="ui-text-note">CEO of Company</small></p>
                </div>
                </div>
            </section> */}
            <section class="ui-section-pricing">
                <div class="ui-layout-container">
                <h2>Pricing</h2>
                <p class="ui-text-intro">Lorem ipsum dolor sit amet.</p>
                {/* <!-- TOGGLE --> */}
                <input type="radio" name="toggle" id="ui-component-toggle__monthly" checked />
                <input type="radio" name="toggle" id="ui-component-toggle__yearly" />
                <div class="ui-component-toggle ui-layout-flex">
                    <label for="ui-component-toggle__monthly" class="ui-component-toggle--label">Billed Monthly</label>
                    <label for="ui-component-toggle__yearly" class="ui-component-toggle--label">Billed Yearly</label>
                </div>
                <p class="ui-text-note"><small>Save 20% with a yearly plan.</small></p>
                {/* <!-- PRICING --> */}
                <div class="ui-section-pricing__layout ui-layout-grid ui-layout-grid-3">
                    <div class="ui-component-card ui-component-card--pricing">
                        <div>
                            <span><strong>Side Gig</strong></span>
                            {/* <!-- AMOUNT --> */}
                            <div class="ui-component-card--pricing-price">
                                <span class="ui-component-card--pricing-amount ui-component-card--pricing-amount-1"></span>
                                {/* <span>/</span>
                                <span>month</span> */}
                            </div>
                            <span><small>Perfect for early-stage startups.</small></span>
                            {/* <!-- LIST --> */}
                            <ul class="ui-component-list ui-component-list--pricing ui-layout-grid">
                                <li class="ui-component-list--item ui-component-list--item-check">3 Students</li>
                                {/* <li class="ui-component-list--item ui-component-list--item-check">Appointment Managment</li>
                                <li class="ui-component-list--item ui-component-list--item-cross">Store and Send Notes, Invoices, and Receipts</li> */}
                            </ul>
                        </div>
                        {/* <!-- CTA --> */}
                        {/* <a href="#" class="ui-component-button ui-component-button-big ui-component-button-secondary" role="link" aria-label="#">Get Started</a> */}
                        <CTA_Button text="Get Started" cls="ui-component-button ui-component-button-big ui-component-button-secondary" />
                    </div>
                    <div class="ui-component-card ui-component-card--pricing">
                        <div>
                            <span><strong>Part-time</strong></span>
                            {/* <!-- AMOUNT --> */}
                            <div class="ui-component-card--pricing-price">
                                <span class="ui-component-card--pricing-amount ui-component-card--pricing-amount-2"></span>
                                <span>/</span>
                                <span>month</span>
                            </div>
                            <span><small>Perfect for early-stage startups.</small></span>
                            {/* <!-- LIST --> */}
                            <ul class="ui-component-list ui-component-list--pricing ui-layout-grid">
                                <li class="ui-component-list--item ui-component-list--item-check">10 Students</li>
                                <li class="ui-component-list--item ui-component-list--item-check">Automatically generate and send invoices</li>
                                <li class="ui-component-list--item ui-component-list--item-check">Accept Credit Card Payments</li>
                            </ul>
                        </div>
                        {/* <!-- CTA --> */}
                        {/* <a href="#" class="ui-component-button ui-component-button-big ui-component-button-primary" role="link" aria-label="#">Get Started</a> */}
                        <CTA_Button text="Get Started" cls="ui-component-button ui-component-button-big ui-component-button-secondary" />
                    </div>
                    <div class="ui-component-card ui-component-card--pricing">
                        <div>
                            <span><strong>Professional</strong></span>
                            {/* <!-- AMOUNT --> */}
                            <div class="ui-component-card--pricing-price">
                                <span class="ui-component-card--pricing-amount ui-component-card--pricing-amount-3"></span>
                                <span>/</span>
                                <span>month</span>
                            </div>
                            <span><small>Perfect for early-stage startups.</small></span>
                            {/* <!-- LIST --> */}
                            <ul class="ui-component-list ui-component-list--pricing ui-layout-grid">
                                <li class="ui-component-list--item ui-component-list--item-check">Unlimited Students</li>
                                <li class="ui-component-list--item ui-component-list--item-check">HTML components.</li>
                                <li class="ui-component-list--item ui-component-list--item-check">Priority support.</li>
                            </ul>
                        </div>
                        {/* <!-- CTA --> */}
                        {/* <a href="#" class="ui-component-button ui-component-button-big ui-component-button-secondary" role="link" aria-label="#">Get Started</a> */}
                        <CTA_Button text="Get Started" cls="ui-component-button ui-component-button-big ui-component-button-secondary" />
                    </div>
                </div>
                </div>
            </section>
            <section class="ui-section-faq">
                <div class="ui-layout-container">
                    {/* <div class="ui-section-faq__layout ui-layout-grid ui-layout-grid-2">
                        <div>
                        <h4 class="ui-component-list--item ui-section-faq--question">Lorem ipsum dolor?</h4>
                        <p class="ui-section-faq--answer">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
                        </div>
                        <div>
                        <h4 class="ui-component-list--item ui-section-faq--question">Lorem ipsum dolor?</h4>
                        <p class="ui-section-faq--answer">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
                        </div>
                        <div>
                        <h4 class="ui-component-list--item ui-section-faq--question">Lorem ipsum dolor?</h4>
                        <p class="ui-section-faq--answer">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
                        </div>
                        <div>
                        <h4 class="ui-component-list--item ui-section-faq--question">Lorem ipsum dolor?</h4>
                        <p class="ui-section-faq--answer">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
                        </div>
                    </div> */}
                    <p class="ui-section-faq--note">Have questions? <a href="#" role="link" aria-label="#">Contact us</a>.</p>
                </div>
            </section>
            <section class="ui-section-close">
                <div class="ui-layout-container">
                <div class="ui-section-close__layout ui-layout-flex">
                    <div>
                    <h2>Ready to start?</h2>
                    <p class="ui-text-intro">Lorem ipsum dolor sit amet consectetur.</p>
                    </div>
                    {/* <!-- CTA --> */}
                    <div class="ui-component-cta ui-layout-flex">
                    {/* <a href="#" role="link" aria-label="#" class="ui-component-button ui-component-button-normal ui-component-button-primary">Get Started for Free</a> */}
                    <CTA_Button text="Get Started for Free" cls="ui-component-button ui-component-button-normal ui-component-button-primary" />
                    <p class="ui-text-note"><small>30 days free trial.</small></p>
                    </div>
                </div>
                </div>
            </section>            
        </>
    );
}