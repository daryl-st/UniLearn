import React, { useEffect, useState } from 'react';
import { UsersAPI } from '@/api/users';
import { CourseAPI } from '@/api/course';
import { ApiError } from '@/api/client';

type Props = {
  onCreated: () => void;
};

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function isUuid(value: string): boolean {
  return UUID_RE.test(value);
}

export const CreateUserForm: React.FC<Props> = ({ onCreated }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'INSTRUCTOR' | 'STUDENT'>('INSTRUCTOR');
  const [courseIds, setCourseIds] = useState<string[]>([]);
  const [courses, setCourses] = useState<Array<{ id: string; code: string; name: string }>>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tempPasswordModal, setTempPasswordModal] = useState<string | null>(null);

  useEffect(() => {
    void (async () => {
      try {
        const list = await CourseAPI.getAllCourses();
        setCourses(list.map((c) => ({ id: c.id, code: c.code, name: c.name })));
      } catch {
        setCourses([]);
      }
    })();
  }, []);

  const toggleCourse = (courseId: string) => {
    setCourseIds((prev) =>
      prev.includes(courseId) ? prev.filter((id) => id !== courseId) : [...prev, courseId],
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const result = await UsersAPI.create({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        role,
        courseIds: role === 'INSTRUCTOR' ? courseIds.filter(isUuid) : undefined,
      });
      setTempPasswordModal(result.temporaryPassword);
      setName('');
      setEmail('');
      setCourseIds([]);
      onCreated();
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError(err instanceof Error ? err.message : 'Failed to create user');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <div className="glass-card p-8 rounded-2xl mb-10">
        <h3 className="font-headline font-bold uppercase tracking-tight text-on-surface mb-6">Add user</h3>
        {error && (
          <p className="text-sm text-destructive font-medium mb-4" role="alert">
            {error}
          </p>
        )}
        <form onSubmit={(e) => void handleSubmit(e)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-surface-low border border-border text-sm px-4 py-2.5 rounded-xl text-on-surface"
              required
            />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-surface-low border border-border text-sm px-4 py-2.5 rounded-xl text-on-surface"
              required
            />
          </div>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value as 'INSTRUCTOR' | 'STUDENT')}
            className="bg-surface-low border border-border text-sm px-4 py-2.5 rounded-xl text-on-surface w-full md:w-auto"
          >
            <option value="INSTRUCTOR">Instructor</option>
            <option value="STUDENT">Student</option>
          </select>
          {role === 'INSTRUCTOR' && (
            <div className="border border-border rounded-xl p-4 max-h-48 overflow-y-auto bg-surface-low/60">
              <p className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant mb-3">
                Assign courses
              </p>
              <div className="space-y-2">
                {courses.map((c) => (
                  <label key={c.id} className="flex items-center gap-2 text-sm text-on-surface cursor-pointer">
                    <input
                      type="checkbox"
                      checked={courseIds.includes(c.id)}
                      onChange={() => toggleCourse(c.id)}
                      className="rounded border-border"
                    />
                    <span>
                      {c.code} — {c.name}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          )}
          <button
            type="submit"
            disabled={submitting}
            className="bg-primary text-on-primary px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider hover:brightness-110 disabled:opacity-50"
          >
            {submitting ? 'Creating…' : 'Create user'}
          </button>
        </form>
      </div>

      {tempPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-surface-low border border-border rounded-2xl p-8 max-w-md w-full shadow-xl">
            <h4 className="font-headline font-bold text-on-surface mb-2">User created</h4>
            <p className="text-sm text-on-surface-variant mb-4">
              Copy this one-time password now. The instructor must change it on first login.
            </p>
            <p className="font-mono text-lg bg-surface p-4 rounded-xl border border-border text-on-surface break-all mb-6">
              {tempPasswordModal}
            </p>
            <button
              type="button"
              onClick={() => setTempPasswordModal(null)}
              className="w-full py-3 bg-primary text-on-primary rounded-xl text-xs font-bold uppercase tracking-wider"
            >
              I have saved the password
            </button>
          </div>
        </div>
      )}
    </>
  );
};
