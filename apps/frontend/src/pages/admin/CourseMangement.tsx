import React, { useEffect, useMemo, useState } from 'react';
import { CheckCircle2, Pencil, Trash2 } from 'lucide-react';
import { CourseAPI, type CourseCatalogRow } from '@/api/course';
import { UsersAPI, type SafeUserRow } from '@/api/users';
import { useCourseStore } from '@/stores/courseStrore';
import type { CreateCourseInput } from '@unilearn/shared-types';

const statusLabels = {
  ACTIVE: 'Active',
  DRAFT: 'Draft',
  ARCHIVED: 'Archived',
} as const;

type CourseFormState = Omit<CreateCourseInput, 'departmentId'> & {
  description?: string;
  status: 'ACTIVE' | 'DRAFT' | 'ARCHIVED';
};

export const CourseManagement: React.FC = () => {
  const { courses, fetchCourses } = useCourseStore();
  const [instructors, setInstructors] = useState<SafeUserRow[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [yearFilter, setYearFilter] = useState<'ALL' | number | '1' | '2' | '3' | '4'>('ALL');
  const [instructorFilter, setInstructorFilter] = useState<string>('');
  const [selectedCourse, setSelectedCourse] = useState<CourseCatalogRow | null>(null);
  const [formState, setFormState] = useState<CourseFormState>({
    name: '',
    code: '',
    acadamicYear: 1,
    instructorId: '',
    description: '',
    status: 'ACTIVE',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        await fetchCourses();
        const allUsers = await UsersAPI.list();
        const instructorOptions = allUsers.filter((user) => user.role === 'INSTRUCTOR');
        setInstructors(instructorOptions);
        setFormState((prev) => ({
          ...prev,
          instructorId: prev.instructorId || instructorOptions[0]?.id || '',
        }));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unable to load instructor or course data.');
      }
    };

    void load();
  }, [fetchCourses]);

  useEffect(() => {
    if (!selectedCourse) return;

    setFormState({
      name: selectedCourse.name,
      code: selectedCourse.code,
      acadamicYear: selectedCourse.acadamicYear,
      instructorId: selectedCourse.instructorId ?? instructors[0]?.id ?? '',
      description: selectedCourse.description ?? '',
      status: selectedCourse.status ?? 'ACTIVE',
    });
  }, [selectedCourse, instructors]);

  const filteredCourses = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    return courses.filter((course) => {
      if (yearFilter !== 'ALL' && String(course.acadamicYear) !== String(yearFilter)) return false;
      if (instructorFilter && instructorFilter !== '') {
        // match instructor id
        if (course.instructorId !== instructorFilter && !(course.instructorNames ?? []).includes(instructors.find(i => i.id === instructorFilter)?.name ?? '')) {
          return false;
        }
      }
      if (!term) return true;
      const inName = course.name?.toLowerCase().includes(term);
      const inInstructor = (course.instructorNames ?? []).join(' ').toLowerCase().includes(term);
      return Boolean(inName || inInstructor || course.code?.toLowerCase().includes(term));
    });
  }, [courses, searchTerm, yearFilter, instructorFilter, instructors]);

  const handleInputChange = (key: keyof CourseFormState, value: string | number) => {
    setFormState((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const resetForm = () => {
    setSelectedCourse(null);
    setFormState({
      name: '',
      code: '',
      acadamicYear: 1,
      instructorId: instructors[0]?.id ?? '',
      description: '',
      status: 'ACTIVE',
    });
    setError(null);
    setMessage(null);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setMessage(null);
    setIsSubmitting(true);

    try {
      const payload: CreateCourseInput = {
        name: formState.name,
        code: formState.code,
        acadamicYear: formState.acadamicYear,
        instructorId: formState.instructorId,
        description: formState.description,
        status: formState.status,
      };

      if (selectedCourse) {
        await CourseAPI.updateCourse(selectedCourse.id, payload);
        setMessage('Course updated successfully.');
      } else {
        await CourseAPI.createCourse(payload);
        setMessage('Course created successfully.');
      }

      await fetchCourses();
      resetForm();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save course.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSelectCourse = (course: CourseCatalogRow) => {
    setSelectedCourse(course);
    setError(null);
    setMessage(null);
  };

  const handleDeleteCourse = async (courseId: string) => {
    if (!window.confirm('Delete this course permanently?')) return;

    setError(null);
    setMessage(null);
    setIsSubmitting(true);

    try {
      await CourseAPI.deleteCourse(courseId);
      await fetchCourses();
      if (selectedCourse?.id === courseId) {
        resetForm();
      }
      setMessage('Course deleted successfully.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete course.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAssignInstructor = async (instructorId: string) => {
    if (!selectedCourse || !instructorId) return;

    setError(null);
    setMessage(null);
    setIsSubmitting(true);

    try {
      await CourseAPI.assignInstructor(selectedCourse.id, instructorId);
      await fetchCourses();
      setMessage('Instructor assigned successfully.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to assign instructor.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUnassignInstructor = async (instructorId: string) => {
    if (!selectedCourse || !instructorId) return;

    setError(null);
    setMessage(null);
    setIsSubmitting(true);

    try {
      await CourseAPI.unassignInstructor(selectedCourse.id, instructorId);
      await fetchCourses();
      setMessage('Instructor removed successfully.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to remove instructor.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const activeCourses = useMemo(() => courses.filter((course) => course.status === 'ACTIVE'), [courses]);
  const draftCourses = useMemo(() => courses.filter((course) => course.status === 'DRAFT'), [courses]);
  const archivedCourses = useMemo(() => courses.filter((course) => course.status === 'ARCHIVED'), [courses]);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between mb-10">
        <div>
          <h1 className="text-4xl font-headline font-bold text-on-surface tracking-tight uppercase">Course Management</h1>
          <p className="mt-2 max-w-2xl text-sm font-medium text-on-surface-variant">
            Manage course catalog entries, update statuses, and assign instructors across the active curriculum.
          </p>
        </div>
        
      </div>

      <div className="grid gap-6 md:grid-cols-3 mb-10">
        <div className="rounded-3xl border border-border bg-surface-low p-6 shadow-sm">
          <p className="text-xs uppercase tracking-[0.2em] text-on-surface-variant">Total courses</p>
          <p className="mt-4 text-3xl font-bold text-on-surface">{courses.length}</p>
        </div>
        <div className="rounded-3xl border border-border bg-surface-low p-6 shadow-sm">
          <p className="text-xs uppercase tracking-[0.2em] text-on-surface-variant">Active</p>
          <p className="mt-4 text-3xl font-bold text-on-surface">{activeCourses.length}</p>
        </div>
        <div className="rounded-3xl border border-border bg-surface-low p-6 shadow-sm">
          <p className="text-xs uppercase tracking-[0.2em] text-on-surface-variant">Draft / archived</p>
          <p className="mt-4 text-3xl font-bold text-on-surface">{draftCourses.length + archivedCourses.length}</p>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.7fr_1fr]">
        <section className="rounded-3xl border border-border bg-surface-low p-6 shadow-sm">
          <div className="mb-6 flex items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-on-surface">Course catalog</h2>
              <p className="mt-1 text-sm text-on-surface-variant">Select a course to edit or create a new entry for the catalog.</p>
            </div>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-700">
              {activeCourses.length} active
            </span>
          </div>

          <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <input
                type="search"
                placeholder="Search by course name or instructor"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="rounded-xl border border-border bg-surface-low px-3 py-2 text-sm text-on-surface"
              />
              <select
                value={yearFilter}
                onChange={(e) => {
                  const v = e.target.value;
                  setYearFilter(v === 'ALL' ? 'ALL' : (Number(v) as 1 | 2 | 3 | 4));
                }}
                className="rounded-xl border border-border bg-surface-low px-3 py-2 text-sm text-on-surface"
              >
                <option value="ALL">All years</option>
                <option value="1">Year 1</option>
                <option value="2">Year 2</option>
                <option value="3">Year 3</option>
                <option value="4">Year 4</option>
              </select>
              <select
                value={instructorFilter}
                onChange={(e) => setInstructorFilter(e.target.value)}
                className="rounded-xl border border-border bg-surface-low px-3 py-2 text-sm text-on-surface"
              >
                <option value="">All instructors</option>
                {instructors.map((ins) => (
                  <option key={ins.id} value={ins.id}>{ins.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="overflow-hidden rounded-3xl border border-border bg-surface shadow-sm">
            <table className="min-w-full text-left text-sm">
              <thead>
                <tr className="bg-surface text-xs uppercase tracking-[0.2em] text-on-surface-variant">
                  <th className="px-5 py-4">Code</th>
                  <th className="px-5 py-4">Course</th>
                  <th className="px-5 py-4">Year</th>
                  <th className="px-5 py-4">Instructor</th>
                  <th className="px-5 py-4">Status</th>
                  <th className="px-5 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredCourses.map((course) => (
                  <tr key={course.id} className="hover:bg-primary/5 transition-colors">
                    <td className="px-5 py-4 font-semibold text-on-surface">{course.code}</td>
                    <td className="px-5 py-4 text-sm text-on-surface-variant">{course.name}</td>
                    <td className="px-5 py-4">Year {course.acadamicYear}</td>
                    <td className="px-5 py-4 text-sm text-on-surface-variant">
                      {course.instructorNames?.length ? course.instructorNames.join(', ') : course.instructorId || 'Unassigned'}
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-[11px] font-semibold ${
                          course.status === 'ACTIVE'
                            ? 'bg-emerald-100 text-emerald-700'
                            : course.status === 'DRAFT'
                            ? 'bg-slate-100 text-slate-700'
                            : 'bg-rose-100 text-rose-700'
                        }`}
                      >
                        {statusLabels[course.status ?? 'ACTIVE']}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <div className="inline-flex items-center gap-2">
                        <button
                          type="button"
                          className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-surface border border-border text-on-surface hover:bg-primary/10"
                          onClick={() => handleSelectCourse(course)}
                          aria-label="Edit course"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-surface border border-border text-on-surface hover:bg-rose-100"
                          onClick={() => void handleDeleteCourse(course.id)}
                          aria-label="Delete course"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="rounded-3xl border border-border bg-surface-low p-6 shadow-sm">
          <div className="mb-6 flex items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-on-surface">{selectedCourse ? 'Edit course' : 'Create course'}</h2>
              <p className="mt-1 text-sm text-on-surface-variant">Update course details and instructor assignments from this panel.</p>
            </div>
            {selectedCourse && <span className="text-xs uppercase tracking-[0.18em] text-on-surface-variant">Selected</span>}
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="mb-2 block text-sm font-semibold text-on-surface">Course name</label>
              <input
                value={formState.name}
                onChange={(event) => handleInputChange('name', event.target.value)}
                placeholder="Artificial Intelligence"
                className="w-full rounded-2xl border border-border bg-surface p-3 text-sm outline-none transition focus:border-primary"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold text-on-surface">Course code</label>
              <input
                value={formState.code}
                onChange={(event) => handleInputChange('code', event.target.value)}
                placeholder="COSC4411"
                className="w-full rounded-2xl border border-border bg-surface p-3 text-sm outline-none transition focus:border-primary"
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-semibold text-on-surface">Academic year</label>
                <input
                  type="number"
                  min={1}
                  max={4}
                  value={formState.acadamicYear}
                  onChange={(event) => handleInputChange('acadamicYear', Number(event.target.value))}
                  className="w-full rounded-2xl border border-border bg-surface p-3 text-sm outline-none transition focus:border-primary"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold text-on-surface">Status</label>
                <select
                  value={formState.status}
                  onChange={(event) => handleInputChange('status', event.target.value)}
                  className="w-full rounded-2xl border border-border bg-surface p-3 text-sm outline-none transition focus:border-primary"
                >
                  <option value="ACTIVE">Active</option>
                  <option value="DRAFT">Draft</option>
                  <option value="ARCHIVED">Archived</option>
                </select>
              </div>
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold text-on-surface">Instructor</label>
              <select
                value={formState.instructorId}
                onChange={(event) => handleInputChange('instructorId', event.target.value)}
                className="w-full rounded-2xl border border-border bg-surface p-3 text-sm outline-none transition focus:border-primary"
              >
                <option value="">Select instructor</option>
                {instructors.map((instructor) => (
                  <option key={instructor.id} value={instructor.id}>
                    {instructor.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold text-on-surface">Course description</label>
              <textarea
                value={formState.description}
                onChange={(event) => handleInputChange('description', event.target.value)}
                rows={4}
                className="w-full rounded-3xl border border-border bg-surface p-3 text-sm outline-none transition focus:border-primary"
              />
            </div>

            {error && <p className="text-sm text-rose-500">{error}</p>}
            {message && <p className="text-sm text-emerald-600">{message}</p>}

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-primary px-5 py-3 text-sm font-bold uppercase tracking-[0.18em] text-on-primary transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <CheckCircle2 className="h-4 w-4" />
                {selectedCourse ? 'Update course' : 'Create course'}
              </button>
              {selectedCourse && (
                <button
                  type="button"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-border bg-surface px-5 py-3 text-sm font-semibold transition hover:bg-primary/10"
                  onClick={resetForm}
                >
                  Clear selection
                </button>
              )}
            </div>
          </form>

          {selectedCourse && (
            <div className="mt-8 rounded-3xl border border-border bg-surface p-5">
              <h3 className="text-base font-bold text-on-surface">Assigned instructors</h3>
              <div className="mt-4 space-y-3">
                {(selectedCourse.instructorNames ?? []).length > 0 ? (
                  (selectedCourse.instructorNames ?? []).map((name) => {
                    const instructor = instructors.find((item) => item.name === name);
                    return (
                      <div key={`${selectedCourse.id}-${name}`} className="flex items-center justify-between rounded-2xl bg-surface-low p-3">
                        <span className="text-sm text-on-surface">{name}</span>
                        <button
                          type="button"
                          className="rounded-full bg-rose-100 px-3 py-1 text-xs font-semibold text-rose-700"
                          onClick={() => void handleUnassignInstructor(instructor?.id ?? '')}
                        >
                          Remove
                        </button>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-sm text-on-surface-variant">No instructors have been assigned to this course yet.</p>
                )}
              </div>

              <div className="mt-5">
                <label className="mb-2 block text-sm font-semibold text-on-surface">Add another instructor</label>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <select
                    value={formState.instructorId}
                    onChange={(event) => handleInputChange('instructorId', event.target.value)}
                    className="w-full rounded-2xl border border-border bg-surface p-3 text-sm outline-none transition focus:border-primary"
                  >
                    <option value="">Select instructor</option>
                    {instructors.map((instructor) => (
                      <option key={instructor.id} value={instructor.id}>
                        {instructor.name}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    disabled={isSubmitting || !formState.instructorId}
                    className="inline-flex items-center justify-center gap-2 rounded-2xl bg-secondary px-5 py-3 text-sm font-bold uppercase tracking-[0.18em] text-on-secondary transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
                    onClick={() => void handleAssignInstructor(formState.instructorId)}
                  >
                    Assign instructor
                  </button>
                </div>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};