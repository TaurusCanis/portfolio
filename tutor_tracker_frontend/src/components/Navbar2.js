

export default function Navbar2() {
    return (
        <header role="banner" class="ui-section-header">
            <div class="ui-layout-container">
                <div class="ui-section-header__layout ui-layout-flex">
                {/* <!-- LOGO --> */}
                <a href="#" role="link" aria-label="#" class="ui-section-header--logo">
                    <svg viewBox="0 0 18 18" height="18" width="18" role="img" aria-label="#">
                    <path fill="#353535" d="M0 0h4.5v9a4.5 4.5 0 109 0V6H18v3A9 9 0 110 9V0zm18 4.5V0h-4.5v4.5H18z"/>
                    </svg>
                </a>
                {/* <!-- HAMBURGER --> */}
                <input type="checkbox" id="ui-section-header--menu-id" />
                <label for="ui-section-header--menu-id" class="ui-section-header--menu-icon"></label>
                {/* <!-- MENU --> */}
                <nav role="navigation" class="ui-section-header--nav ui-layout-flex">
                    <a href="#" role="link" aria-label="#" class="ui-section-header--nav-link">Features</a>
                    <a href="#" role="link" aria-label="#" class="ui-section-header--nav-link">Pricing</a>
                    <a href="#" role="link" aria-label="#" class="ui-section-header--nav-link">About</a>
                </nav>
                </div>
            </div>
        </header>
    );
}