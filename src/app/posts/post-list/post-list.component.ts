import { Component, OnInit, OnDestroy } from "@angular/core";
import { Subscription } from 'rxjs';

import{ PostsService } from '../posts.service'
import { Post } from "../post.model";
import { PageEvent } from "@angular/material/paginator";
import { AuthService } from "src/app/auth/auth.service";

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['post-list.component.css'],
})
export class PostListComponent implements OnInit, OnDestroy {
  posts: Post[] = [];
  private postsSub!: Subscription;
  isLoading: boolean = false;
  totalPosts: number = 0;
  postPerPage: number = 5;
  currentPage: number = 1;
  pageSizeOptions: number[] = [1, 2, 5, 10];
  userId?:string
  private authStatusSub!: Subscription;
  userIsAuthenticated: boolean = false;

  constructor(
    public postsService: PostsService,
    private authService: AuthService
  ) {   }

  ngOnInit() {
    this.isLoading = true;
    this.postsService.getPosts(this.postPerPage, 1);
    this.userId = this.authService.getUserId();
    this.postsSub = this.postsService
      .getPostUpdatedListener()
      .subscribe((postsData: {posts:Post[], postCount: number}) => {
        this.isLoading = false;
        this.totalPosts = postsData.postCount;
        this.posts = postsData.posts;
      });
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authStatusSub = this.authService.getAuthStatusListener().subscribe(isAuthenticated => {
      this.userIsAuthenticated = isAuthenticated;
      this.userId = this.authService.getUserId();
    });
  }

  onChangedPage(pageData: PageEvent){
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.postPerPage = pageData.pageSize;
    this.postsService.getPosts(this.postPerPage, this.currentPage);
  }

  onDelete(postId:string){
    this.isLoading = true;
    this.postsService.deletePost(postId)
    .subscribe(()=>{
      this.postsService.getPosts(this.postPerPage, this.currentPage)
    },() => {
      this.isLoading = false;
    });
  }

  ngOnDestroy() {
    this.postsSub.unsubscribe();
    this.authStatusSub.unsubscribe();
  }
}
