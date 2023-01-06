// import homeImage from "../img/homeImage.svg";
// import moneyTransfer from "../img/moneyTransfer.svg";
import test_cartoon from "../img/test_cartoon.jpg";
import standardized_test from "../img/standardized_test.jpg";
import { Link } from "react-router-dom";
import CTA_Button from "../components/CTA_Button";

export default function Home() {
    return (
        <>
            <section class="ui-section-hero">
                <div class="ui-layout-container">
                <div class="ui-section-hero__layout ui-layout-grid ui-layout-grid-2">
                    {/* <!-- COPYWRITING --> */}
                    <div>
                    <h1>Ace It! Test Prep</h1>
                    <p class="ui-text-intro">Online SSAT Prep</p>
                    {/* <!-- CTA --> */}
                    <div class="ui-component-cta ui-layout-flex">
                        {/* <a href="#" role="link" aria-label="#" class="ui-component-button ui-component-button-normal ui-component-button-primary">Get Started for Free</a> */}
                        <CTA_Button text="Get Started for Free" cls="ui-component-button ui-component-button-normal ui-component-button-primary" />
                        <p class="ui-text-note"><small>30 days free trial.</small></p>
                    </div>
                    </div>
                    {/* <!-- IMAGE --> */}
                    {/* <img src="https://res.cloudinary.com/uisual/image/upload/assets/devices/ipad.png" loading="lazy" alt="#" class="ui-image-half-right" /> */}
                    <img src={test_cartoon} loading="lazy" alt="#" class="ui-image-half-right" />
                </div>
                </div>
            </section>
        </>
            
    );
}