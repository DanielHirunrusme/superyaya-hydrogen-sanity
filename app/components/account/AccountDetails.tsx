import type {Customer} from '@shopify/hydrogen/storefront-api-types';
import clsx from 'clsx';

import {Link} from '~/components/Link';

export function AccountDetails({customer}: {customer: Customer}) {
  const {firstName, lastName, email, phone} = customer;

  return (
    <>
      <div>
        <div className="flex items-baseline gap-3">
          <h3 className="align-baseline  ">Profile</h3>
          <Link
            prefetch="intent"
            className=" "
            to="/account/edit"
            preventScrollReset
          >
            Edit
          </Link>
        </div>

        <div className="mt-4 space-y-4">
          <div className="space-y-1">
            <div className=" ">Name</div>
            <p className={clsx(!firstName && !lastName && 'italic ')}>
              {firstName || lastName
                ? (firstName ? firstName + ' ' : '') + lastName
                : 'Add name'}{' '}
            </p>
          </div>
          <div className="space-y-1">
            <div className=" ">Phone</div>
            <p className={clsx(!phone && 'italic ')}>{phone ?? 'Not added'}</p>
          </div>
          <div className="space-y-1">
            <div className=" ">Email address</div>
            <p>{email}</p>
          </div>
          <div className="space-y-1">
            <div className=" ">Password</div>
            <p>**************</p>
          </div>
        </div>
      </div>
    </>
  );
}
