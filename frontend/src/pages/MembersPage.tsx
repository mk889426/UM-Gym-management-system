// src/pages/MembersPage.tsx
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../hooks';
import { fetchMembers } from '../features/member/memberSlice';
import Loader from '../components/Loader';

export default function MembersPage() {
  const dispatch = useAppDispatch();
  const { list, status } = useAppSelector((s) => s.member);

  useEffect(() => {
    dispatch(fetchMembers());
  }, [dispatch]);

  if (status === 'loading') return <Loader />;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-secondary mb-4">Members</h2>
      <ul className="space-y-2">
        {list.map((m) => (
          <li key={m.id}>
            <Link
              to={`/members/${m.id}`}
              className="block p-4 bg-white rounded shadow hover:bg-bg transition"
            >
              {m.name} — {m.membershipType}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}