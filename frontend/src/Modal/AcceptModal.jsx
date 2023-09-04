
function AcceptModal() {
  return (
    <div
      data-te-modal-init
      className="fixed inset-0 z-[1055] flex items-center justify-center bg-opacity-50 bg-gray-900 transition-opacity duration-300 overflow-y-auto">
      <div
        data-te-modal-dialog-ref
        className="w-full max-w-lg p-4 bg-white dark:bg-neutral-600 rounded-md shadow-lg">
        <div className="flex justify-between pb-4 border-b border-neutral-100 dark:border-neutral-500">
          <h5 className="text-xl font-medium text-neutral-800 dark:text-neutral-200">
            Modal title
          </h5>
          <button
            type="button"
            className="p-1 ml-auto rounded hover:bg-neutral-100 dark:hover:bg-neutral-700 focus:outline-none focus:ring"
            data-te-modal-dismiss
            aria-label="Close">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="w-6 h-6">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <div className="p-4" data-te-modal-body-ref>
          Modal body text goes here.
        </div>
        <div className="flex justify-end pt-4 border-t border-neutral-100 dark:border-neutral-500">
          <button
            type="button"
            className="px-4 py-2 mr-2 text-xs font-medium text-white uppercase bg-primary-600 rounded-lg shadow-sm hover:bg-primary-700 focus:outline-none focus:ring focus:ring-primary-200 active:bg-primary-700"
            data-te-modal-dismiss
            data-te-ripple-init
            data-te-ripple-color="light">
            Close
          </button>
          <button
            type="button"
            className="px-4 py-2 text-xs font-medium text-white uppercase bg-primary-600 rounded-lg shadow-md hover:bg-primary-700 focus:outline-none focus:ring focus:ring-primary-200 active:bg-primary-700"
            data-te-ripple-init
            data-te-ripple-color="light">
            Save changes
          </button>
        </div>
      </div>
    </div>
  );
}

export default AcceptModal;
