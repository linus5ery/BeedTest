import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgForm } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { CallApiService } from 'src/app/call-api.service';

@Component({
  selector: 'app-student-list',
  templateUrl: './student-list.component.html',
  styleUrls: ['./student-list.component.css']
})
export class StudentListComponent implements OnInit {
  students: any[] = [];
  private apiUrl = 'http://localhost:8080/api/v1/main'; // Replace with your API endpoint
  alertMessage: string | null = null;
  alertType: string = '';
  student: any = { id: '', name: '', age: null, sex: 1 };
  studentModalTitle: string = '';
  modalReference: any = null;
  studentDataModified: boolean = false;

  @ViewChild('studentModal') studentModal: any;

  constructor(
    private http: HttpClient,
    private modalService: NgbModal,
    private callApiService: CallApiService,
  ) { }

  ngOnInit(): void {
    this.fetchStudents();
  }

  fetchStudents(): void {
    this.http.get<any[]>(`${this.apiUrl}/getAllStudents`).subscribe(
      (data) => {
        this.students = data;
      },
      (error) => {
        console.error('Error fetching students:', error);
        this.showAlert('Failed to fetch student data.', 'danger');
      }
    );
  }

  replaceStudents(): void {
    this.http.post<any>(`${this.apiUrl}/replaceStudents`, this.students).subscribe(
      (data) => {
        this.showAlert('Success to replace student data.', 'success');
      },
      (error) => {
        console.error('Error fetching students:', error);
        this.showAlert('Failed to replace student data.', 'danger');
      }
    );
  }

  showAlert(message: string, type: string): void {
    this.alertMessage = message;
    this.alertType = type;
  }

  closeAlert(): void {
    this.alertMessage = null;
  }

  showModal(student?: any): void {
    this.student = student ? { ...student } : { id: '', name: '', age: null, sex: 1 };
    console.log(this.student);
    this.studentModalTitle = student ? 'Edit Student' : 'Add Student';
    this.modalReference = this.modalService.open(this.studentModal, { ariaLabelledBy: 'modal-basic-title' });
  }

  onSubmit(form: NgForm): void {
    if (form.invalid) {
      return;
    }
    if (this.student.id) {
      // Update student
      let index = this.students.findIndex((student => student.id == this.student.id));
      this.students[index] = this.student;
      this.modalReference.close();
      this.showAlert('Success to update student data.', 'success');
      this.studentDataModified = true;
    } else {
      // Add new student
      let id = Number(this.students[this.students.length - 1].id) + 1;
      this.student.id = id;
      this.students.push(this.student);
      this.modalReference.close();
      this.showAlert('Success to add student data.', 'success');
      this.studentDataModified = true;
    }
  }

  deleteRow(index: number): void {
    let result = confirm('Are you sure want to delete this student data?');
    if(result) {
      // Remove the row at the specified index.
      this.students.splice(index, 1);
      this.showAlert('Success to delete student data.', 'success');
      this.studentDataModified = true;
    }
  }

  callApi(): void {
    // Call the API from the Node.js project.
    if(this.studentDataModified) {
      // this.replaceStudents();
      this.callApiService.replaceStudents(this.students)
      .then(() => {
        this.showAlert('Success to replace student data with the service.', 'success');
      })
      .catch(() => {
        this.showAlert('Failed to replace student data with the service.', 'danger');
      });
      this.studentDataModified = false;
    } else {
      this.fetchStudents();
    }
  }
}
