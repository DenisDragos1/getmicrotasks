import PropTypes from 'prop-types';
import { Link } from "react-router-dom";

Modal.propTypes = {
    setOpenModal: PropTypes.func.isRequired,
  };
  function Modal({ setOpenModal }) {
    return (
      <div className="fixed inset-0 flex items-center justify-center z-50">
        <div className="bg-white w-1/2 p-6 rounded-lg shadow-lg">
          <div className="flex justify-end">
            <button
              onClick={() => {
                setOpenModal(false);
              }}
              className="text-gray-700 hover:text-gray-900"
            >
              X
            </button>
          </div>
          <div className="text-center mt-4">
            <h1 className="text-2xl font-bold mb-2">
              Are You Sure You Want to Continue?
            </h1>
            <p>The next page looks amazing. Hope you want to go there!</p>
          </div>
          <div className="flex justify-end mt-6">
            <button
              onClick={() => {
                setOpenModal(false);
              }}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded mr-2"
            >
              Cancel
            </button>
            <Link to={'/'}>
            <button  className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded">
              Continue
            </button>
            </Link>
          </div>
        </div>
      </div>
    );
  }
  
  export default Modal;
  