import { Link } from 'react-router-dom';

function Sidebar() {
  return (
    <div>
      {/* Sidebar */}
      <div id="containerSidebar" className="z-40">
        <div className="navbar-menu relative z-40">
          <nav
            id="sidebar"
            className="fixed left-0 bottom-0 flex w-3/4 -translate-x-full flex-col overflow-y-auto bg-gray-700 pt-6 pb-8 sm:max-w-xs lg:w-80"
          >
            {/* one category / navigation group */}
            <div className="px-4 pb-6">
              <h3 className="mb-2 text-xs font-medium uppercase text-gray-500">
                Main
              </h3>
              <ul className="mb-8 text-sm font-medium">
                <li>
                  <Link
                    to="/homepage"
                    className="flex items-center rounded py-3 pl-3 pr-4 text-gray-50 hover:bg-gray-600"
                  >
                    Homepage
                  </Link>
                </li>
                <li>
                  <Link
                    to="/link1"
                    className="flex items-center rounded py-3 pl-3 pr-4 text-gray-50 hover:bg-gray-600"
                  >
                    link1
                  </Link>
                </li>
              </ul>
            </div>
            {/* navigation group end*/}
            {/* example copies start */}
            <div className="px-4 pb-6">
              <h3 className="mb-2 text-xs font-medium uppercase text-gray-500">
                Legal
              </h3>
              <ul className="mb-8 text-sm font-medium">
                <li>
                  <Link
                    to="/tc"
                    className="flex items-center rounded py-3 pl-3 pr-4 text-gray-50 hover:bg-gray-600"
                  >
                    Terms and Condition
                  </Link>
                </li>
                <li>
                  <Link
                    to="/privacy"
                    className="flex items-center rounded py-3 pl-3 pr-4 text-gray-50 hover:bg-gray-600"
                  >
                    Privacy policy
                  </Link>
                </li>
                <li>
                  <Link
                    to="/imprint"
                    className="flex items-center rounded py-3 pl-3 pr-4 text-gray-50 hover:bg-gray-600"
                  >
                    Imprint
                  </Link>
                </li>
              </ul>
            </div>
            <div className="px-4 pb-6">
              <h3 className="mb-2 text-xs font-medium uppercase text-gray-500">
                Others
              </h3>
              <ul className="mb-8 text-sm font-medium">
                <li>
                  <Link
                    to="/ex1"
                    className="flex items-center rounded py-3 pl-3 pr-4 text-gray-50 hover:bg-gray-600"
                  >
                    ...
                  </Link>
                </li>
                <li>
                  <Link
                    to="/ex2"
                    className="flex items-center rounded py-3 pl-3 pr-4 text-gray-50 hover:bg-gray-600"
                  >
                    ...
                  </Link>
                </li>
              </ul>
            </div>
            {/* example copies end */}
          </nav>
        </div>
        <div className="mx-auto lg:ml-80"></div>
      </div>
      {/* Sidebar end */}
      <main>{/* your content goes here */}</main>
    </div>
  );
}

export default Sidebar;
